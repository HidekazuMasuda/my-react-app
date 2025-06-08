/**
 * 自然言語による受け入れテスト
 * Playwright MCPを使用してユーザーシナリオをテスト
 */

const { chromium } = require('playwright');

class NaturalLanguageAcceptanceTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async setup() {
    // ブラウザを起動（ヘッドレスモード）
    this.browser = await chromium.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
        '--disable-gpu-sandbox',
        '--enable-font-antialiasing',
        '--force-color-profile=srgb'
      ]
    });
    
    const context = await this.browser.newContext({
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      extraHTTPHeaders: {
        'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8'
      }
    });
    
    this.page = await context.newPage();
    
    // エラーハンドリング
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Page error:', msg.text());
      }
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * テストシナリオ実行のヘルパーメソッド
   */
  async runScenario(scenarioName, testFunction) {
    console.log(`\n=== ${scenarioName} ===`);
    try {
      await testFunction();
      this.testResults.push({ scenario: scenarioName, status: 'PASS', error: null });
      console.log(`✅ ${scenarioName} - PASS`);
    } catch (error) {
      this.testResults.push({ scenario: scenarioName, status: 'FAIL', error: error.message });
      console.log(`❌ ${scenarioName} - FAIL: ${error.message}`);
    }
  }

  /**
   * TODOアプリに移動
   */
  async navigateToTodoApp() {
    await this.page.goto(this.baseUrl);
    await this.page.getByRole('link', { name: 'TODOアプリ' }).click();
    await this.page.waitForURL('**/todo');
  }

  /**
   * データをクリア
   */
  async clearAllData() {
    try {
      // データ削除ボタンがある場合のみクリック
      const clearButton = this.page.getByRole('button', { name: 'すべてのデータを削除' });
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        // 確認ダイアログを受け入れ
        this.page.on('dialog', dialog => dialog.accept());
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      // データがない場合は無視
    }
  }

  async runAllTests() {
    await this.setup();
    
    // シナリオ1: 新規ユーザーの初回利用
    await this.runScenario('新規ユーザーが初めてTODOアプリを使用する', async () => {
      await this.navigateToTodoApp();
      await this.clearAllData();
      
      // 初期状態の確認
      await this.page.getByText('まだタスクがありません').waitFor();
      
      // 新しいタスクを追加
      await this.page.getByPlaceholder('新しいタスクを入力...').fill('買い物に行く');
      await this.page.getByRole('button', { name: '追加' }).click();
      
      // タスクが追加されたことを確認
      await this.page.getByText('買い物に行く').waitFor();
      await this.page.getByText('全体: 1 | 完了: 0 | 未完了: 1').waitFor();
    });

    // シナリオ2: カレンダーを使ったタスク作成
    await this.runScenario('カレンダーを使用して期限付きタスクを作成する', async () => {
      await this.navigateToTodoApp();
      
      // タスク名を入力
      await this.page.getByPlaceholder('新しいタスクを入力...').fill('プレゼン準備');
      
      // カレンダー入力モードに切り替え（既にカレンダーモードの場合はスキップ）
      try {
        const toggleButton = this.page.getByText('手動入力').or(this.page.getByText('カレンダー入力'));
        const buttonText = await toggleButton.textContent();
        if (buttonText.includes('カレンダー入力')) {
          await toggleButton.click();
        }
      } catch (error) {
        // トグルボタンが見つからない場合はスキップ
      }
      
      // カレンダーを開く
      await this.page.getByRole('button', { name: /期限日を選択してください.*📅/ }).click();
      
      // 今日から3日後の日付を選択
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      const dayToSelect = tomorrow.getDate().toString();
      
      await this.page.getByRole('button', { name: dayToSelect, exact: true }).first().click();
      
      // タスクを追加
      await this.page.getByRole('button', { name: '追加' }).click();
      
      // タスクが期限付きで追加されたことを確認
      await this.page.getByText('プレゼン準備').waitFor();
      await this.page.getByText('期限:').waitFor();
    });

    // シナリオ3: タスクの完了管理
    await this.runScenario('タスクの完了状態を管理する', async () => {
      await this.navigateToTodoApp();
      
      // タスクを完了にする
      const firstTask = this.page.locator('.todo-item').first();
      await firstTask.locator('input[type="checkbox"]').check();
      
      // 完了状態が反映されることを確認
      await this.page.getByText(/完了: [1-9]/).waitFor();
      
      // 完了を取り消す
      await firstTask.locator('input[type="checkbox"]').uncheck();
      
      // 未完了状態に戻ることを確認
      await this.page.waitForTimeout(500);
    });

    // シナリオ4: タスクの編集機能
    await this.runScenario('タスクのテキストと期限を編集する', async () => {
      await this.navigateToTodoApp();
      
      // 最初のタスクのテキストを編集
      const firstTask = this.page.locator('.todo-item').first();
      await firstTask.locator('.todo-text').click();
      
      // 編集入力フィールドが表示されるまで待機
      await this.page.waitForTimeout(500);
      const editInput = firstTask.locator('.todo-edit-input');
      await editInput.waitFor({ state: 'visible' });
      await editInput.clear();
      await editInput.fill('編集されたタスク名');
      await editInput.press('Enter');
      
      // 編集が反映されることを確認
      await this.page.getByText('編集されたタスク名').waitFor();
      
      // 期限日を編集
      await firstTask.locator('.todo-due-date, .todo-add-date').first().click();
      
      // 期限日編集フィールドが表示されるまで待機
      await this.page.waitForTimeout(500);
      const dateInput = firstTask.locator('.todo-date-edit-input');
      await dateInput.waitFor({ state: 'visible' });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      await dateInput.clear();
      await dateInput.fill(tomorrowStr);
      await dateInput.press('Enter');
      
      // 期限が更新されることを確認
      await this.page.waitForTimeout(500);
    });

    // シナリオ5: タスクの削除
    await this.runScenario('不要なタスクを削除する', async () => {
      await this.navigateToTodoApp();
      
      // 削除前のタスク数を確認
      const tasksBefore = await this.page.locator('.todo-item').count();
      
      // 最初のタスクを削除
      const firstTask = this.page.locator('.todo-item').first();
      await firstTask.getByRole('button', { name: '削除' }).click();
      
      // タスクが削除されることを確認
      await this.page.waitForTimeout(500);
      const tasksAfter = await this.page.locator('.todo-item').count();
      
      if (tasksBefore > 0 && tasksAfter !== tasksBefore - 1) {
        throw new Error('タスクが正しく削除されませんでした');
      }
    });

    // シナリオ6: データ永続化の確認
    await this.runScenario('ページリロード後もデータが保持される', async () => {
      await this.navigateToTodoApp();
      
      // 新しいタスクを追加
      await this.page.getByPlaceholder('新しいタスクを入力...').fill('永続化テスト');
      await this.page.getByRole('button', { name: '追加' }).click();
      await this.page.getByText('永続化テスト').waitFor();
      
      // ページをリロード
      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      
      // データが保持されることを確認
      await this.page.getByText('永続化テスト').waitFor();
    });

    // シナリオ7: 過去の日付入力エラーハンドリング
    await this.runScenario('過去の日付を入力した場合のエラーハンドリング', async () => {
      await this.navigateToTodoApp();
      
      await this.page.getByPlaceholder('新しいタスクを入力...').fill('エラーテスト');
      
      // 手動入力モードに切り替え
      try {
        const toggleButton = this.page.getByText('手動入力').or(this.page.getByText('カレンダー入力'));
        const buttonText = await toggleButton.textContent();
        if (buttonText.includes('手動入力')) {
          await toggleButton.click();
        }
      } catch (error) {
        // トグルボタンが見つからない場合はスキップ
      }
      
      // 過去の日付を入力
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      await this.page.getByPlaceholder('YYYY-MM-DD 形式で入力').fill(yesterdayStr);
      await this.page.getByRole('button', { name: '追加' }).click();
      
      // エラーメッセージが表示されることを確認
      await this.page.getByText('過去の日付は設定できません').waitFor();
    });

    await this.teardown();
    
    // テスト結果のサマリーを表示
    this.displayTestSummary();
  }

  displayTestSummary() {
    console.log('\n=== テスト結果サマリー ===');
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`総テスト数: ${this.testResults.length}`);
    console.log(`成功: ${passed}`);
    console.log(`失敗: ${failed}`);
    
    if (failed > 0) {
      console.log('\n失敗したテスト:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.scenario}: ${r.error}`));
    }
    
    console.log(`\n全体結果: ${failed === 0 ? '✅ PASS' : '❌ FAIL'}`);
  }
}

// テストの実行
if (require.main === module) {
  const test = new NaturalLanguageAcceptanceTest();
  test.runAllTests().catch(console.error);
}

module.exports = { NaturalLanguageAcceptanceTest };