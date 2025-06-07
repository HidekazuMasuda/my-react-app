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
    
    // 期限日を手動入力
    await page.fill('.date-input.manual', '2024-12-31');
    
    // TODOを追加
    await page.click('.add-button');
    
    // 期限日が表示されることを確認
    await expect(page.locator('.todo-due-date')).toBeVisible();
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2024/12/31');
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

  test('期限切れのTODOにハイライト表示される', async ({ page }) => {
    await page.goto('/todo');
    
    // 過去の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '期限切れタスク');
    
    // 過去の日付を設定
    await page.fill('.date-input.manual', pastDate);
    
    // TODOを追加
    await page.click('.add-button');
    
    // 期限切れのスタイルが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/overdue/);
  });

  test('完了したTODOは期限日ハイライトが無効になる', async ({ page }) => {
    await page.goto('/todo');
    
    // 過去の日付を取得
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    
    // 手動入力モードに切り替え
    await page.click('.toggle-date-input');
    
    // TODOを入力
    await page.fill('.todo-input', '完了予定タスク');
    await page.fill('.date-input.manual', pastDate);
    await page.click('.add-button');
    
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
});