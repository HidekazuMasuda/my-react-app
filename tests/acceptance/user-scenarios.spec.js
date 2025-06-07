/**
 * 受け入れテスト - ユーザーシナリオ
 * 
 * 利用者の立場から自然言語的な観点でのテストシナリオ
 */

const { test, expect } = require('@playwright/test');
const { AcceptanceTestRunner } = require('./acceptance-test-runner');

test.describe('TODOアプリ - ユーザーシナリオテスト', () => {
  let testRunner;

  test.beforeEach(async ({ page }) => {
    testRunner = new AcceptanceTestRunner(page);
    await testRunner.navigateToTodoApp();
    
    // テスト前にデータをクリア
    try {
      await testRunner.clearAllData();
    } catch (error) {
      // データが既にない場合は無視
    }
  });

  test('シナリオ1: 新しいユーザーが初めてTODOアプリを使用する', async () => {
    // Given: 新しいユーザーがTODOアプリにアクセスした
    // Then: 何もタスクがない状態で、使い方が分かりやすく表示されている
    await expect(testRunner.page.getByText('まだタスクがありません')).toBeVisible();
    await expect(testRunner.page.getByPlaceholder('新しいタスクを入力...')).toBeVisible();
    
    // When: 初めてのタスクを追加する
    await testRunner.addTaskManually('買い物に行く');
    
    // Then: タスクが正常に追加され、統計情報が更新される
    await testRunner.expectTaskExists('買い物に行く');
    await testRunner.expectStatistics(1, 0, 1);
  });

  test('シナリオ2: 忙しいビジネスパーソンが期限付きタスクを管理する', async () => {
    // Given: 忙しいビジネスパーソンが複数の期限付きタスクを管理したい
    
    // When: 緊急度の高いタスクを期限付きで追加する
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    await testRunner.addTaskManually('プレゼン資料作成', tomorrowStr);
    await testRunner.addTaskManually('顧客との会議準備', tomorrowStr);
    
    // When: 来週の予定も追加する
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    await testRunner.addTaskManually('月次レポート作成', nextWeekStr);
    
    // Then: すべてのタスクが期限とともに表示される
    await testRunner.expectTaskExists('プレゼン資料作成');
    await testRunner.expectTaskExists('顧客との会議準備');
    await testRunner.expectTaskExists('月次レポート作成');
    await testRunner.expectStatistics(3, 0, 3);
    
    // When: 1つのタスクを完了にする
    await testRunner.toggleTaskCompletion('プレゼン資料作成');
    
    // Then: 完了統計が更新される
    await testRunner.expectTaskCompleted('プレゼン資料作成', true);
    await testRunner.expectStatistics(3, 1, 2);
  });

  test('シナリオ3: 家事管理をする主婦/主夫がカレンダーを使って予定を立てる', async () => {
    // Given: 家事の予定をカレンダーで視覚的に管理したい
    
    // When: カレンダーを使って掃除の予定を立てる
    const cleaningDate = new Date();
    cleaningDate.setDate(cleaningDate.getDate() + 3);
    
    await testRunner.addTaskWithCalendar('リビングの大掃除', cleaningDate.toISOString().split('T')[0]);
    
    // When: 買い物の予定も追加
    const shoppingDate = new Date();
    shoppingDate.setDate(shoppingDate.getDate() + 5);
    
    await testRunner.addTaskWithCalendar('週末の買い出し', shoppingDate.toISOString().split('T')[0]);
    
    // Then: カレンダーで選択した日付でタスクが作成される
    await testRunner.expectTaskExists('リビングの大掃除');
    await testRunner.expectTaskExists('週末の買い出し');
    await testRunner.expectStatistics(2, 0, 2);
  });

  test('シナリオ4: 学生が課題管理でタスクの編集と削除を行う', async () => {
    // Given: 学生が複数の課題を管理している
    await testRunner.addTaskManually('数学のレポート提出');
    await testRunner.addTaskManually('英語の小テスト準備');
    await testRunner.addTaskManually('化学の実験レポート');
    
    // When: タスクの内容を詳細に編集する
    await testRunner.editTaskText('数学のレポート提出', '数学のレポート提出（統計学の章末問題）');
    
    // When: 期限を追加する
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    await testRunner.editTaskDueDate('英語の小テスト準備', dueDateStr);
    
    // When: 間違って追加したタスクを削除する
    await testRunner.deleteTask('化学の実験レポート');
    
    // Then: 編集と削除が正しく反映される
    await testRunner.expectTaskExists('数学のレポート提出（統計学の章末問題）');
    await testRunner.expectTaskExists('英語の小テスト準備');
    await testRunner.expectTaskNotExists('化学の実験レポート');
    await testRunner.expectStatistics(2, 0, 2);
  });

  test('シナリオ5: 完璧主義者がタスクを完了して達成感を味わう', async () => {
    // Given: 完璧主義者が今日やるべきことをリストアップした
    await testRunner.addTaskManually('メールチェック');
    await testRunner.addTaskManually('ジョギング');
    await testRunner.addTaskManually('読書（30分）');
    await testRunner.addTaskManually('部屋の片付け');
    
    // When: 1つずつタスクを完了していく
    await testRunner.toggleTaskCompletion('メールチェック');
    await testRunner.expectTaskCompleted('メールチェック', true);
    await testRunner.expectStatistics(4, 1, 3);
    
    await testRunner.toggleTaskCompletion('ジョギング');
    await testRunner.expectTaskCompleted('ジョギング', true);
    await testRunner.expectStatistics(4, 2, 2);
    
    await testRunner.toggleTaskCompletion('読書（30分）');
    await testRunner.expectTaskCompleted('読書（30分）', true);
    await testRunner.expectStatistics(4, 3, 1);
    
    // When: 最後のタスクも完了する
    await testRunner.toggleTaskCompletion('部屋の片付け');
    
    // Then: すべてのタスクが完了し、達成感のある統計が表示される
    await testRunner.expectTaskCompleted('部屋の片付け', true);
    await testRunner.expectStatistics(4, 4, 0);
  });

  test('シナリオ6: プロジェクトマネージャーが誤操作から回復する', async () => {
    // Given: プロジェクトマネージャーが重要なタスクリストを作成した
    await testRunner.addTaskManually('チームミーティング準備');
    await testRunner.addTaskManually('クライアント提案書作成');
    await testRunner.addTaskManually('予算見積もり作成');
    
    // When: 間違って完了にしてしまう
    await testRunner.toggleTaskCompletion('クライアント提案書作成');
    await testRunner.expectTaskCompleted('クライアント提案書作成', true);
    
    // When: 間違いに気づいて未完了に戻す
    await testRunner.toggleTaskCompletion('クライアント提案書作成');
    
    // Then: 正しく未完了状態に戻る
    await testRunner.expectTaskCompleted('クライアント提案書作成', false);
    await testRunner.expectStatistics(3, 0, 3);
    
    // When: 間違ってタスクを削除してしまった場合は新しく追加し直す
    await testRunner.deleteTask('予算見積もり作成');
    await testRunner.expectTaskNotExists('予算見積もり作成');
    
    // 再度追加
    await testRunner.addTaskManually('予算見積もり作成（修正版）');
    await testRunner.expectTaskExists('予算見積もり作成（修正版）');
    await testRunner.expectStatistics(3, 0, 3);
  });

  test('シナリオ7: 長期利用者がデータの永続化を確認する', async () => {
    // Given: 長期利用者がタスクを作成した
    await testRunner.addTaskManually('重要な長期プロジェクト');
    await testRunner.toggleTaskCompletion('重要な長期プロジェクト');
    
    // When: ページをリロードする
    await testRunner.page.reload();
    await testRunner.page.waitForLoadState('networkidle');
    
    // Then: データが保持されている
    await testRunner.expectTaskExists('重要な長期プロジェクト');
    await testRunner.expectTaskCompleted('重要な長期プロジェクト', true);
    await testRunner.expectStatistics(1, 1, 0);
  });
});