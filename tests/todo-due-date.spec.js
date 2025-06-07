import { test, expect } from '@playwright/test';

test.describe('TODOアプリ - 期限日機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todo');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('カレンダー入力で期限日を設定できる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを入力
    await page.fill('.todo-input', '期限ありタスク');
    
    // 期限日を設定（今日の日付）
    const today = new Date().toISOString().split('T')[0];
    await page.fill('.date-input.calendar', today);
    
    // TODOを追加
    await page.click('.add-button');
    
    // 期限日が表示されることを確認
    await expect(page.locator('.todo-due-date')).toBeVisible();
    await expect(page.locator('.todo-due-date')).toContainText('期限:');
  });

  test('手動入力で期限日を設定できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '手動期限タスク');
    
    // 期限日を手動入力（未来の日付）
    await page.fill('.date-input.manual', '2025-12-31');
    
    // TODOを追加
    await page.click('.add-button');
    
    // 期限日が表示されることを確認
    await expect(page.locator('.todo-due-date')).toBeVisible();
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2025/12/31');
  });

  test('カレンダー入力と手動入力を切り替えできる', async ({ page }) => {
    await page.goto('/todo');
    
    // 初期状態はカレンダー入力
    await expect(page.locator('.date-input.calendar')).toBeVisible();
    await expect(page.locator('.date-input.manual')).not.toBeVisible();
    
    // 手動入力に切り替え
    await page.click('.toggle-date-input');
    await expect(page.locator('.date-input.manual')).toBeVisible();
    await expect(page.locator('.date-input.calendar')).not.toBeVisible();
    await expect(page.locator('.toggle-date-input')).toContainText('カレンダー入力');
    
    // カレンダー入力に戻す
    await page.click('.toggle-date-input');
    await expect(page.locator('.date-input.calendar')).toBeVisible();
    await expect(page.locator('.date-input.manual')).not.toBeVisible();
    await expect(page.locator('.toggle-date-input')).toContainText('手動入力');
  });

  test('期限日なしでTODOを追加できる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを入力（期限日は設定しない）
    await page.fill('.todo-input', '期限なしタスク');
    await page.click('.add-button');
    
    // TODOが追加され、期限日表示がないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toContainText('期限なしタスク');
    await expect(page.locator('.todo-due-date')).not.toBeVisible();
  });

  test('今日が期限のTODOにハイライト表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 今日の日付を取得
    const today = new Date().toISOString().split('T')[0];
    
    // TODOを入力
    await page.fill('.todo-input', '今日期限のタスク');
    
    // 今日の日付を期限日に設定
    await page.fill('.date-input.calendar', today);
    
    // TODOを追加
    await page.click('.add-button');
    
    // 今日期限のスタイルが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/due-today/);
  });

  test('期限切れのTODOにハイライト表示される（手動でlocalStorageを設定）', async ({ page }) => {
    await page.goto('/todo');
    
    // 過去の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    // localStorageに過去日のTODOを直接設定
    await page.evaluate((pastDate) => {
      const todos = [{
        id: Date.now(),
        text: '期限切れタスク',
        completed: false,
        dueDate: pastDate
      }];
      localStorage.setItem('todos', JSON.stringify(todos));
    }, pastDate);
    
    // ページをリロードしてTODOを表示
    await page.reload();
    
    // localStorageの内容を確認
    const storedData = await page.evaluate(() => localStorage.getItem('todos'));
    console.log('localStorage after reload:', storedData);
    
    // TODOアイテムが表示されるまで待機
    await expect(page.locator('.todo-item')).toBeVisible({ timeout: 10000 });
    
    // 期限切れのスタイルが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/overdue/);
  });

  test('完了したTODOは期限日ハイライトが無効になる（手動でlocalStorageを設定）', async ({ page }) => {
    await page.goto('/todo');
    
    // 過去の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    // localStorageに過去日のTODOを直接設定
    await page.evaluate((pastDate) => {
      const todos = [{
        id: Date.now(),
        text: '完了予定タスク',
        completed: false,
        dueDate: pastDate
      }];
      localStorage.setItem('todos', JSON.stringify(todos));
    }, pastDate);
    
    // ページをリロードしてTODOを表示
    await page.reload();
    
    // TODOアイテムが表示されるまで待機
    await expect(page.locator('.todo-item')).toBeVisible({ timeout: 10000 });
    
    // 期限切れスタイルが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/overdue/);
    
    // TODOを完了にする
    await page.click('.todo-checkbox');
    
    // 完了スタイルが適用され、期限切れスタイルが無効になることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
    await expect(page.locator('.todo-item')).not.toHaveClass(/overdue/);
  });

  test('期限日入力後にフィールドがクリアされる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOと期限日を入力
    await page.fill('.todo-input', 'クリアテスト');
    
    const today = new Date().toISOString().split('T')[0];
    await page.fill('.date-input.calendar', today);
    
    // TODOを追加
    await page.click('.add-button');
    
    // 入力フィールドがクリアされることを確認
    await expect(page.locator('.todo-input')).toHaveValue('');
    await expect(page.locator('.date-input.calendar')).toHaveValue('');
  });

  test('期限日をクリックして編集できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加（未来の日付）
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await page.fill('.todo-input', '期限編集テスト');
    await page.fill('.date-input.calendar', futureDateString);
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 編集用入力フィールドが表示されることを確認
    await expect(page.locator('.todo-date-edit-input')).toBeVisible();
    await expect(page.locator('.todo-date-edit-input')).toHaveValue(futureDateString);
    
    // 期限日を変更（未来の日付）
    await page.fill('.todo-date-edit-input', '2025-12-25');
    
    // Enterキーで保存
    await page.press('.todo-date-edit-input', 'Enter');
    
    // 変更された期限日が表示されることを確認
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2025/12/25');
    await expect(page.locator('.todo-date-edit-input')).not.toBeVisible();
  });

  test('期限日なしのTODOに期限を追加できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日なしのTODOを追加
    await page.fill('.todo-input', '期限追加テスト');
    await page.click('.add-button');
    
    // 「期限を追加」をクリック
    await page.click('.todo-add-date');
    
    // 編集用入力フィールドが表示されることを確認
    await expect(page.locator('.todo-date-edit-input')).toBeVisible();
    await expect(page.locator('.todo-date-edit-input')).toHaveValue('');
    
    // 期限日を設定（未来の日付）
    await page.fill('.todo-date-edit-input', '2025-12-31');
    
    // Enterキーで保存
    await page.press('.todo-date-edit-input', 'Enter');
    
    // 期限日が表示されることを確認
    await expect(page.locator('.todo-due-date')).toBeVisible();
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2025/12/31');
    await expect(page.locator('.todo-add-date')).not.toBeVisible();
  });

  test('期限日編集中にEscapeキーでキャンセルできる', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加
    await page.fill('.todo-input', 'キャンセルテスト');
    await page.fill('.date-input.calendar', '2024-12-25');
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 期限日を変更
    await page.fill('.todo-date-edit-input', '2025-06-01');
    
    // Escapeキーでキャンセル
    await page.press('.todo-date-edit-input', 'Escape');
    
    // 元の期限日がそのまま残ることを確認
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2024/12/25');
    await expect(page.locator('.todo-date-edit-input')).not.toBeVisible();
  });

  test('期限日を空にして削除できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加
    await page.fill('.todo-input', '期限削除テスト');
    await page.fill('.date-input.calendar', '2024-12-25');
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 期限日を空にする
    await page.fill('.todo-date-edit-input', '');
    
    // Enterキーで保存
    await page.press('.todo-date-edit-input', 'Enter');
    
    // 期限日が削除されて「期限を追加」が表示されることを確認
    await expect(page.locator('.todo-due-date')).not.toBeVisible();
    await expect(page.locator('.todo-add-date')).toBeVisible();
    await expect(page.locator('.todo-add-date')).toContainText('期限を追加');
  });

  test('期限日編集中にフォーカスを外すと保存される', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加（未来の日付）
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await page.fill('.todo-input', 'フォーカス外しテスト');
    await page.fill('.date-input.calendar', futureDateString);
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 期限日を変更（未来の日付）
    await page.fill('.todo-date-edit-input', '2025-12-31');
    
    // 他の場所をクリックしてフォーカスを外す
    await page.click('.todo-container h1');
    
    // 変更された期限日が保存されることを確認
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2025/12/31');
    await expect(page.locator('.todo-date-edit-input')).not.toBeVisible();
  });

  test('手動入力で不正な日付形式の場合エラーが表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '不正日付テスト');
    
    // 不正な形式の日付を入力
    await page.fill('.date-input.manual', '2025/02/30');
    
    // TODOを追加を試行
    await page.click('.add-button');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('YYYY-MM-DD形式で入力してください');
    
    // TODOが追加されていないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    
    // 入力フィールドにエラースタイルが適用されることを確認
    await expect(page.locator('.date-input.manual')).toHaveClass(/error/);
  });

  test('手動入力で存在しない日付の場合エラーが表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '存在しない日付テスト');
    
    // 存在しない日付を入力（2月31日）
    await page.fill('.date-input.manual', '2025-02-31');
    
    // TODOを追加を試行
    await page.click('.add-button');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('存在しない日付です');
    
    // TODOが追加されていないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('期限日編集で不正な日付を入力するとエラーが表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加
    await page.fill('.todo-input', '編集エラーテスト');
    await page.fill('.date-input.calendar', '2024-12-25');
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 不正な日付を入力
    await page.fill('.todo-date-edit-input', '2025-13-50');
    
    // Enterキーで保存を試行
    await page.press('.todo-date-edit-input', 'Enter');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('存在しない日付です');
    
    // 元の期限日がそのまま残ることを確認
    await expect(page.locator('.todo-date-edit-input')).toBeVisible();
    await expect(page.locator('.todo-date-edit-input')).toHaveClass(/error/);
  });

  test('日付入力中にエラーがクリアされる', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', 'エラークリアテスト');
    
    // 不正な日付を入力してエラーを発生させる
    await page.fill('.date-input.manual', '2025-02-31');
    await page.click('.add-button');
    
    // エラーが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    
    // 正しい日付を入力（未来の日付）
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateString = futureDate.toISOString().split('T')[0];
    await page.fill('.date-input.manual', futureDateString);
    
    // エラーがクリアされることを確認
    await expect(page.locator('.error-message')).not.toBeVisible();
    await expect(page.locator('.date-input.manual')).not.toHaveClass(/error/);
    
    // TODOを追加
    await page.click('.add-button');
    
    // TODOが正常に追加されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-due-date')).toBeVisible();
  });

  test('Escapeキーで編集をキャンセルするとエラーもクリアされる', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加（未来の日付）
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await page.fill('.todo-input', 'エラーキャンセルテスト');
    await page.fill('.date-input.calendar', futureDateString);
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 不正な日付を入力してエラーを発生させる
    await page.fill('.todo-date-edit-input', '2025-99-99');
    await page.press('.todo-date-edit-input', 'Enter');
    
    // エラーが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    
    // Escapeキーでキャンセル
    await page.press('.todo-date-edit-input', 'Escape');
    
    // 編集モードが終了し、エラーもクリアされることを確認
    await expect(page.locator('.todo-date-edit-input')).not.toBeVisible();
    await expect(page.locator('.error-message')).not.toBeVisible();
    await expect(page.locator('.todo-due-date')).toBeVisible();
  });

  test('手動入力で過去の日付を入力するとエラーが表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '過去日テスト');
    
    // 昨日の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    // 過去の日付を入力
    await page.fill('.date-input.manual', pastDate);
    
    // TODOを追加を試行
    await page.click('.add-button');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('過去の日付は設定できません');
    
    // TODOが追加されていないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    
    // 入力フィールドにエラースタイルが適用されることを確認
    await expect(page.locator('.date-input.manual')).toHaveClass(/error/);
  });

  test('期限日編集で過去の日付を入力するとエラーが表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 今日の日付で期限日付きTODOを追加
    const today = new Date().toISOString().split('T')[0];
    await page.fill('.todo-input', '過去日編集テスト');
    await page.fill('.date-input.calendar', today);
    await page.click('.add-button');
    
    // 期限日をクリックして編集モードに
    await page.click('.todo-due-date');
    
    // 過去の日付を入力
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    await page.fill('.todo-date-edit-input', pastDate);
    
    // Enterキーで保存を試行
    await page.press('.todo-date-edit-input', 'Enter');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('過去の日付は設定できません');
    
    // 編集モードが継続され、元の日付が保持されることを確認
    await expect(page.locator('.todo-date-edit-input')).toBeVisible();
    await expect(page.locator('.todo-date-edit-input')).toHaveClass(/error/);
  });

  test('今日の日付は設定できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '今日期限テスト');
    
    // 今日の日付を入力
    const today = new Date().toISOString().split('T')[0];
    await page.fill('.date-input.manual', today);
    
    // TODOを追加
    await page.click('.add-button');
    
    // エラーが表示されないことを確認
    await expect(page.locator('.error-message')).not.toBeVisible();
    
    // TODOが正常に追加されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-due-date')).toBeVisible();
    
    // 今日期限のハイライトが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/due-today/);
  });

  test('未来の日付は設定できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '未来期限テスト');
    
    // 明日の日付を入力
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];
    
    await page.fill('.date-input.manual', futureDate);
    
    // TODOを追加
    await page.click('.add-button');
    
    // エラーが表示されないことを確認
    await expect(page.locator('.error-message')).not.toBeVisible();
    
    // TODOが正常に追加されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-due-date')).toBeVisible();
  });
});