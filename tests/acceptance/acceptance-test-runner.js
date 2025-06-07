/**
 * Acceptance Test Runner
 * 
 * 自然言語による受け入れテストを実行するためのテストランナー
 * Playwright MCPを使用してブラウザ操作を行う
 */

const { test, expect } = require('@playwright/test');

/**
 * 受け入れテストのベースクラス
 */
class AcceptanceTestRunner {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'http://localhost:3000';
  }

  /**
   * TODOアプリページに移動
   */
  async navigateToTodoApp() {
    await this.page.goto(this.baseUrl);
    await this.page.getByRole('link', { name: 'TODOアプリ' }).click();
    await this.page.waitForURL('**/todo');
  }

  /**
   * 新しいタスクを追加（手動入力）
   */
  async addTaskManually(taskText, dueDate = null) {
    await this.page.getByPlaceholder('新しいタスクを入力...').fill(taskText);
    
    if (dueDate) {
      // 手動入力モードに切り替え
      const toggleButton = this.page.getByRole('button', { name: '手動入力' });
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
      }
      
      await this.page.getByPlaceholder('YYYY-MM-DD 形式で入力').fill(dueDate);
    }
    
    await this.page.getByRole('button', { name: '追加' }).click();
  }

  /**
   * 新しいタスクを追加（カレンダー入力）
   */
  async addTaskWithCalendar(taskText, targetDate) {
    await this.page.getByPlaceholder('新しいタスクを入力...').fill(taskText);
    
    // カレンダー入力モードに切り替え
    const toggleButton = this.page.getByRole('button', { name: 'カレンダー入力' });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
    }
    
    // カレンダーを開く
    await this.page.getByRole('button', { name: /期限日を選択してください/ }).click();
    
    // 指定された日付をクリック
    const date = new Date(targetDate);
    const dayButton = this.page.getByRole('button', { name: date.getDate().toString(), exact: true });
    await dayButton.click();
    
    await this.page.getByRole('button', { name: '追加' }).click();
  }

  /**
   * タスクの完了状態を切り替え
   */
  async toggleTaskCompletion(taskText) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: taskText });
    await taskRow.locator('input[type="checkbox"]').click();
  }

  /**
   * タスクを削除
   */
  async deleteTask(taskText) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: taskText });
    await taskRow.getByRole('button', { name: '削除' }).click();
  }

  /**
   * タスクのテキストを編集
   */
  async editTaskText(oldText, newText) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: oldText });
    await taskRow.locator('.todo-text').click();
    
    const input = taskRow.locator('.todo-edit-input');
    await input.fill(newText);
    await input.press('Enter');
  }

  /**
   * タスクの期限日を編集
   */
  async editTaskDueDate(taskText, newDueDate) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: taskText });
    
    // 期限日部分をクリック（期限がある場合）または「期限を追加」をクリック
    const dueDateElement = taskRow.locator('.todo-due-date, .todo-add-date');
    await dueDateElement.click();
    
    const dateInput = taskRow.locator('.todo-date-edit-input');
    await dateInput.fill(newDueDate);
    await dateInput.press('Enter');
  }

  /**
   * すべてのデータを削除
   */
  async clearAllData() {
    await this.page.getByRole('button', { name: 'すべてのデータを削除' }).click();
    
    // 確認ダイアログを受け入れ
    this.page.on('dialog', dialog => dialog.accept());
  }

  /**
   * 統計情報を取得
   */
  async getStatistics() {
    const statsText = await this.page.locator('.todo-stats p').first().textContent();
    const match = statsText.match(/全体: (\d+) \| 完了: (\d+) \| 未完了: (\d+)/);
    
    return {
      total: parseInt(match[1]),
      completed: parseInt(match[2]),
      pending: parseInt(match[3])
    };
  }

  /**
   * タスクが存在することを確認
   */
  async expectTaskExists(taskText) {
    await expect(this.page.locator('.todo-item').filter({ hasText: taskText })).toBeVisible();
  }

  /**
   * タスクが存在しないことを確認
   */
  async expectTaskNotExists(taskText) {
    await expect(this.page.locator('.todo-item').filter({ hasText: taskText })).not.toBeVisible();
  }

  /**
   * タスクの完了状態を確認
   */
  async expectTaskCompleted(taskText, isCompleted) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: taskText });
    const checkbox = taskRow.locator('input[type="checkbox"]');
    
    if (isCompleted) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  /**
   * 統計情報を確認
   */
  async expectStatistics(total, completed, pending) {
    const stats = await this.getStatistics();
    expect(stats.total).toBe(total);
    expect(stats.completed).toBe(completed);
    expect(stats.pending).toBe(pending);
  }
}

module.exports = { AcceptanceTestRunner };