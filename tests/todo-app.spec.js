import { test, expect } from '@playwright/test';

test.describe('TODOアプリ', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にlocalStorageをクリア
    await page.goto('/todo');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TODOアプリにアクセスできる', async ({ page }) => {
    await page.goto('/todo');
    await expect(page).toHaveTitle(/React App/);
    await expect(page.locator('h1')).toContainText('TODOアプリ');
  });

  test('新しいTODOを追加できる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', 'テストタスク');
    await page.click('.add-button');
    
    // TODOが表示されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toContainText('テストタスク');
    
    // 統計が更新されることを確認
    await expect(page.locator('.todo-stats p')).toContainText('全体: 1');
    await expect(page.locator('.todo-stats p')).toContainText('未完了: 1');
  });

  test('Enterキーで新しいTODOを追加できる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加（Enterキー）
    await page.fill('.todo-input', 'Enterキーテスト');
    await page.press('.todo-input', 'Enter');
    
    // TODOが表示されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toContainText('Enterキーテスト');
  });

  test('TODOを完了状態に切り替えできる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '完了テスト');
    await page.click('.add-button');
    
    // 完了状態に切り替え
    await page.click('.todo-checkbox');
    
    // 完了状態のスタイルが適用されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
    
    // 統計が更新されることを確認
    await expect(page.locator('.todo-stats p')).toContainText('完了: 1');
    await expect(page.locator('.todo-stats p')).toContainText('未完了: 0');
  });

  test('TODOを削除できる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '削除テスト');
    await page.click('.add-button');
    
    // 削除ボタンをクリック
    await page.click('.delete-button');
    
    // TODOが削除されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
    
    // 統計が更新されることを確認
    await expect(page.locator('.todo-stats p')).toContainText('全体: 0');
  });

  test('複数のTODOを管理できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 複数のTODOを追加
    const todos = ['タスク1', 'タスク2', 'タスク3'];
    
    for (const todo of todos) {
      await page.fill('.todo-input', todo);
      await page.click('.add-button');
    }
    
    // 3つのTODOが表示されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(3);
    
    // 1つを完了状態にする
    await page.locator('.todo-item').first().locator('.todo-checkbox').click();
    
    // 統計が正しく更新されることを確認
    await expect(page.locator('.todo-stats p')).toContainText('全体: 3');
    await expect(page.locator('.todo-stats p')).toContainText('完了: 1');
    await expect(page.locator('.todo-stats p')).toContainText('未完了: 2');
  });

  test('空のTODOは追加できない', async ({ page }) => {
    await page.goto('/todo');
    
    // 空の入力で追加ボタンをクリック
    await page.click('.add-button');
    
    // TODOが追加されないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });

  test('空白のみのTODOは追加できない', async ({ page }) => {
    await page.goto('/todo');
    
    // 空白のみの入力で追加
    await page.fill('.todo-input', '   ');
    await page.click('.add-button');
    
    // TODOが追加されないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });

  test('TODOリスト初期化ボタンが機能する', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '削除予定タスク');
    await page.click('.add-button');
    
    // 確認ダイアログを処理
    page.once('dialog', dialog => dialog.accept());
    
    // 初期化ボタンをクリック
    await page.click('.clear-data-button');
    
    // TODOが削除されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });
});