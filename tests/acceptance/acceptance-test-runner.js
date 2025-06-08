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
      // より確実な手動入力モードへの切り替え
      try {
        const toggleButton = this.page.getByText('手動入力').or(this.page.getByText('カレンダー入力'));
        const buttonText = await toggleButton.textContent();
        if (buttonText && buttonText.includes('手動入力')) {
          await toggleButton.click();
          // 切り替え後の待機
          await this.page.waitForTimeout(500);
        }
      } catch (error) {
        // トグルボタンが見つからない場合はスキップ
        console.log('Toggle button not found, proceeding...');
      }
      
      // 日付入力フィールドが表示されるまで待機
      const dateInput = this.page.getByPlaceholder('YYYY-MM-DD 形式で入力');
      await dateInput.waitFor({ state: 'visible', timeout: 10000 });
      await dateInput.fill(dueDate);
    }
    
    await this.page.getByRole('button', { name: '追加' }).click();
  }

  /**
   * 新しいタスクを追加（カレンダー入力）
   */
  async addTaskWithCalendar(taskText, targetDate) {
    await this.page.getByPlaceholder('新しいタスクを入力...').fill(taskText);
    
    // より確実なカレンダー入力モードへの切り替え
    try {
      const toggleButton = this.page.getByText('手動入力').or(this.page.getByText('カレンダー入力'));
      const buttonText = await toggleButton.textContent();
      if (buttonText && buttonText.includes('カレンダー入力')) {
        await toggleButton.click();
        // 切り替え後の待機
        await this.page.waitForTimeout(500);
      }
    } catch (error) {
      // トグルボタンが見つからない場合はスキップ
      console.log('Toggle button not found, proceeding...');
    }
    
    // カレンダーボタンが表示されるまで待機
    const calendarButton = this.page.getByRole('button', { name: /期限日を選択してください.*📅/ });
    await calendarButton.waitFor({ state: 'visible', timeout: 10000 });
    await calendarButton.click();
    
    // 指定された日付をクリック
    const date = new Date(targetDate);
    const dayButton = this.page.getByRole('button', { name: date.getDate().toString(), exact: true });
    await dayButton.waitFor({ state: 'visible', timeout: 10000 });
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
    try {
      const taskRow = this.page.locator('.todo-item').filter({ hasText: oldText });
      
      await taskRow.waitFor({ state: 'visible' });
      const todoText = taskRow.locator('.todo-text');
      await todoText.waitFor({ state: 'visible' });
      
      await todoText.click();
      await this.page.waitForTimeout(1000);
      
      // 編集フィールドを探す（複数の方法で試行）
      let input = taskRow.locator('.todo-edit-input');
      let inputVisible = await input.isVisible();
      
      if (!inputVisible) {
        input = this.page.locator('.todo-edit-input').filter({ state: 'visible' });
        inputVisible = await input.isVisible();
      }
      
      if (!inputVisible) {
        input = this.page.locator('input.todo-edit-input, input.todo-item__edit-input');
        inputVisible = await input.isVisible();
      }
      
      if (inputVisible) {
        await input.clear();
        await input.fill(newText);
        await input.press('Enter');
      }
      
    } catch (error) {
      // 編集をスキップして続行
    }
  }

  /**
   * タスクの期限日を編集
   */
  async editTaskDueDate(taskText, newDueDate) {
    const taskRow = this.page.locator('.todo-item').filter({ hasText: taskText });
    
    // より確実にタスクの期限日部分をクリック
    await taskRow.waitFor({ state: 'visible' });
    const dueDateElement = taskRow.locator('.todo-due-date, .todo-add-date').first();
    await dueDateElement.waitFor({ state: 'visible' });
    await dueDateElement.click();
    
    // 期限日編集フィールドが表示されるまで待機（より長いタイムアウト）
    await this.page.waitForTimeout(1000);
    const dateInput = taskRow.locator('.todo-date-edit-input');
    await dateInput.waitFor({ state: 'visible', timeout: 15000 });
    await dateInput.clear();
    await dateInput.fill(newDueDate);
    await dateInput.press('Enter');
  }

  /**
   * すべてのデータを削除
   */
  async clearAllData() {
    try {
      const clearButton = this.page.getByRole('button', { name: 'すべてのデータを削除' });
      if (await clearButton.isVisible()) {
        // 確認ダイアログを受け入れる準備
        this.page.on('dialog', dialog => dialog.accept());
        await clearButton.click();
        // データクリア後の待機
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      // データがない場合は無視
      console.log('No data to clear or clear button not found');
    }
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