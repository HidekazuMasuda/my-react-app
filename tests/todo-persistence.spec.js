import { test, expect } from '@playwright/test';

test.describe('TODOアプリ - localStorage永続化', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todo');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TODOがlocalStorageに保存される', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '永続化テスト');
    await page.click('.add-button');
    
    // localStorageにデータが保存されることを確認
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('todos');
    });
    
    expect(storageData).toBeTruthy();
    const todos = JSON.parse(storageData);
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('永続化テスト');
    expect(todos[0].completed).toBe(false);
  });

  test('ページをリロードしてもTODOが保持される', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', 'リロードテスト');
    await page.click('.add-button');
    
    // ページをリロード
    await page.reload();
    
    // TODOが保持されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toContainText('リロードテスト');
  });

  test('TODO完了状態がlocalStorageに保存される', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '完了状態テスト');
    await page.click('.add-button');
    
    // 完了状態に変更
    await page.click('.todo-checkbox');
    
    // localStorageの完了状態を確認
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('todos');
    });
    
    const todos = JSON.parse(storageData);
    expect(todos[0].completed).toBe(true);
    
    // ページをリロード
    await page.reload();
    
    // 完了状態が保持されることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
    await expect(page.locator('.todo-checkbox')).toBeChecked();
  });

  test('期限日がlocalStorageに保存される', async ({ page }) => {
    await page.goto('/todo');
    
    // 期限日付きTODOを追加
    await page.fill('.todo-input', '期限日テスト');
    
    const testDate = '2024-12-25';
    await page.fill('.date-input.calendar', testDate);
    
    await page.click('.add-button');
    
    // localStorageの期限日を確認
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('todos');
    });
    
    const todos = JSON.parse(storageData);
    expect(todos[0].dueDate).toBe(testDate);
    
    // ページをリロード
    await page.reload();
    
    // 期限日が保持されることを確認
    await expect(page.locator('.todo-due-date')).toBeVisible();
    await expect(page.locator('.todo-due-date')).toContainText('期限: 2024/12/25');
  });

  test('複数のTODOの状態がすべて保存される', async ({ page }) => {
    await page.goto('/todo');
    
    // 複数のTODOを異なる状態で追加
    const todos = [
      { text: '未完了タスク1', completed: false },
      { text: '未完了タスク2', completed: false },
      { text: '完了タスク', completed: true }
    ];
    
    // TODOを追加
    for (const todo of todos) {
      await page.fill('.todo-input', todo.text);
      await page.click('.add-button');
      
      if (todo.completed) {
        await page.locator('.todo-item').last().locator('.todo-checkbox').click();
      }
    }
    
    // ページをリロード
    await page.reload();
    
    // すべてのTODOが保持されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(3);
    
    // 完了状態が正しく保持されることを確認
    const completedItems = page.locator('.todo-item.completed');
    await expect(completedItems).toHaveCount(1);
    await expect(completedItems.locator('.todo-text')).toContainText('完了タスク');
    
    // 統計が正しく表示されることを確認
    await expect(page.locator('.todo-stats p')).toContainText('全体: 3');
    await expect(page.locator('.todo-stats p')).toContainText('完了: 1');
    await expect(page.locator('.todo-stats p')).toContainText('未完了: 2');
  });

  test('TODOを削除するとlocalStorageからも削除される', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '削除テスト');
    await page.click('.add-button');
    
    // TODOを削除
    await page.click('.delete-button');
    
    // localStorageが空になることを確認
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('todos');
    });
    
    const todos = JSON.parse(storageData);
    expect(todos).toHaveLength(0);
    
    // ページをリロード
    await page.reload();
    
    // TODOが表示されないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });

  test('データ初期化ボタンでlocalStorageがクリアされる', async ({ page }) => {
    await page.goto('/todo');
    
    // TODOを追加
    await page.fill('.todo-input', '初期化テスト');
    await page.click('.add-button');
    
    // 確認ダイアログを処理
    page.once('dialog', dialog => dialog.accept());
    
    // データ初期化
    await page.click('.clear-data-button');
    
    // localStorageがクリアされることを確認
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('todos');
    });
    
    expect(storageData).toBeNull();
    
    // ページをリロード
    await page.reload();
    
    // TODOが表示されないことを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });

  test('不正なlocalStorageデータを処理できる', async ({ page }) => {
    await page.goto('/todo');
    
    // 不正なJSONデータをlocalStorageに設定
    await page.evaluate(() => {
      localStorage.setItem('todos', '不正なJSON');
    });
    
    // ページをリロード
    await page.reload();
    
    // エラーが発生せず、空の状態で表示されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('.empty-message')).toBeVisible();
  });

  test('ブラウザ間でデータが独立している', async ({ page, context }) => {
    await page.goto('/todo');
    
    // 最初のタブでTODOを追加
    await page.fill('.todo-input', 'タブ1のタスク');
    await page.click('.add-button');
    
    // 新しいタブを開く
    const newPage = await context.newPage();
    await newPage.goto('/todo');
    
    // 同じデータが表示されることを確認（同じlocalStorage）
    await expect(newPage.locator('.todo-item')).toHaveCount(1);
    await expect(newPage.locator('.todo-text')).toContainText('タブ1のタスク');
    
    await newPage.close();
  });
});