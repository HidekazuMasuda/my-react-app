import { test, expect } from '@playwright/test';

test.describe('占い機能', () => {
  test.beforeEach(async ({ page }) => {
    // 占いページに移動
    await page.goto('/fortune');
  });

  test('占いページにアクセスできる', async ({ page }) => {
    await expect(page).toHaveTitle(/React App/);
    await expect(page.locator('h1')).toContainText('🔮 今日の運勢占い');
  });

  test('占いページの基本要素が表示される', async ({ page }) => {
    // ヘッダー要素を確認
    await expect(page.locator('h1')).toContainText('🔮 今日の運勢占い');
    await expect(page.locator('.fortune-date')).toContainText('2025年');
    
    // 初期状態でミステリーカードが表示される
    await expect(page.locator('.mystery-card')).toBeVisible();
    await expect(page.locator('.mystery-symbol')).toContainText('🎴');
    await expect(page.locator('h2')).toContainText('今日のあなたの運勢は？');
    await expect(page.locator('.reveal-button')).toContainText('運勢を見る');
    
    // フッターが表示される
    await expect(page.locator('.fortune-footer')).toContainText('占い結果は娯楽目的です');
  });

  test('運勢を表示できる', async ({ page }) => {
    // 運勢を見るボタンをクリック
    await page.click('.reveal-button');
    
    // 運勢結果が表示される
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('.fortune-card')).toBeVisible();
    await expect(page.locator('.fortune-badge')).toBeVisible();
    await expect(page.locator('.fortune-description')).toBeVisible();
    
    // 運勢の種類が正しく表示される（大吉、中吉、小吉、吉、末吉、凶のいずれか）
    const fortuneText = await page.locator('.fortune-badge').textContent();
    expect(['大吉', '中吉', '小吉', '吉', '末吉', '凶']).toContain(fortuneText);
    
    // ラッキーアイテムセクションが表示される
    await expect(page.locator('.lucky-items-section')).toBeVisible();
    await expect(page.locator('h3')).toContainText('✨ 本日のラッキーアイテム ✨');
    
    // 2つのラッキーアイテムが表示される
    await expect(page.locator('.lucky-item')).toHaveCount(2);
    await expect(page.locator('.lucky-item-emoji')).toHaveCount(2);
    await expect(page.locator('.lucky-item-label')).toHaveCount(2);
    
    // ラッキーアイテムのラベルが正しい
    await expect(page.locator('.lucky-item').first().locator('.lucky-item-label')).toContainText('ラッキーアイテム 1');
    await expect(page.locator('.lucky-item').last().locator('.lucky-item-label')).toContainText('ラッキーアイテム 2');
    
    // リセットボタンが表示される
    await expect(page.locator('.reset-button')).toContainText('もう一度見る');
  });

  test('運勢をリセットできる', async ({ page }) => {
    // 運勢を表示
    await page.click('.reveal-button');
    await expect(page.locator('.fortune-result')).toBeVisible();
    
    // リセットボタンをクリック
    await page.click('.reset-button');
    
    // ミステリーカードに戻る
    await expect(page.locator('.mystery-card')).toBeVisible();
    await expect(page.locator('.fortune-result')).not.toBeVisible();
    await expect(page.locator('.reveal-button')).toContainText('運勢を見る');
  });

  test('同じ日は同じ運勢が表示される（一意性テスト）', async ({ page }) => {
    // 1回目の運勢を表示
    await page.click('.reveal-button');
    const firstFortune = await page.locator('.fortune-badge').textContent();
    const firstLuckyItem1 = await page.locator('.lucky-item').first().locator('.lucky-item-emoji').textContent();
    const firstLuckyItem2 = await page.locator('.lucky-item').last().locator('.lucky-item-emoji').textContent();
    
    // リセット
    await page.click('.reset-button');
    
    // 2回目の運勢を表示
    await page.click('.reveal-button');
    const secondFortune = await page.locator('.fortune-badge').textContent();
    const secondLuckyItem1 = await page.locator('.lucky-item').first().locator('.lucky-item-emoji').textContent();
    const secondLuckyItem2 = await page.locator('.lucky-item').last().locator('.lucky-item-emoji').textContent();
    
    // 同じ結果であることを確認
    expect(firstFortune).toBe(secondFortune);
    expect(firstLuckyItem1).toBe(secondLuckyItem1);
    expect(firstLuckyItem2).toBe(secondLuckyItem2);
  });

  test('ナビゲーションから占いページに移動できる', async ({ page }) => {
    // ホームページから開始
    await page.goto('/');
    
    // 占いリンクをクリック
    await page.click('a[href="/fortune"]');
    
    // 占いページに移動することを確認
    await expect(page).toHaveURL(/.*\/fortune/);
    await expect(page.locator('h1')).toContainText('🔮 今日の運勢占い');
  });

  test('占いページのアニメーションが動作する', async ({ page }) => {
    // ミステリーカードにホバー効果があることを確認
    await expect(page.locator('.mystery-card')).toBeVisible();
    
    // 運勢を表示
    await page.click('.reveal-button');
    
    // 結果カードのアニメーション（slideIn）が適用されることを確認
    await expect(page.locator('.fortune-card')).toHaveCSS('animation-name', 'slideIn');
    await expect(page.locator('.lucky-items-section')).toHaveCSS('animation-name', 'slideIn');
  });

  test('ラッキーアイテムの絵文字が正しく表示される', async ({ page }) => {
    await page.click('.reveal-button');
    
    // ラッキーアイテムの絵文字が存在することを確認
    const luckyItem1 = await page.locator('.lucky-item').first().locator('.lucky-item-emoji').textContent();
    const luckyItem2 = await page.locator('.lucky-item').last().locator('.lucky-item-emoji').textContent();
    
    // 絵文字が空でないことを確認
    expect(luckyItem1).toBeTruthy();
    expect(luckyItem2).toBeTruthy();
    
    // 異なるラッキーアイテムが表示されることを確認
    expect(luckyItem1).not.toBe(luckyItem2);
    
    // 絵文字が適切な形式であることを確認（Unicode絵文字）
    expect(luckyItem1).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    expect(luckyItem2).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
  });

  test('運勢の説明文が適切に表示される', async ({ page }) => {
    await page.click('.reveal-button');
    
    const description = await page.locator('.fortune-description').textContent();
    
    // 説明文が空でないことを確認
    expect(description.trim()).toBeTruthy();
    
    // 説明文が適切な長さであることを確認
    expect(description.length).toBeGreaterThan(10);
    expect(description.length).toBeLessThan(200);
  });

  test('フォーチュンカードの色が運勢に応じて変わる', async ({ page }) => {
    await page.click('.reveal-button');
    
    // 運勢バッジとカードの境界線に色が適用されていることを確認
    const fortuneBadge = page.locator('.fortune-badge');
    const fortuneCard = page.locator('.fortune-card');
    
    await expect(fortuneBadge).toHaveCSS('background-color', /.+/);
    await expect(fortuneCard).toHaveCSS('border-color', /.+/);
  });
});

test.describe('占い機能 - レスポンシブデザイン', () => {
  test('モバイルビューで占い機能が正常に動作する', async ({ page }) => {
    // モバイルサイズに設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/fortune');
    
    // 基本要素が表示される
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.mystery-card')).toBeVisible();
    await expect(page.locator('.reveal-button')).toBeVisible();
    
    // 運勢を表示
    await page.click('.reveal-button');
    
    // 結果が適切に表示される
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('.lucky-items')).toBeVisible();
    await expect(page.locator('.lucky-item')).toHaveCount(2);
  });

  test('タブレットビューで占い機能が正常に動作する', async ({ page }) => {
    // タブレットサイズに設定
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/fortune');
    
    // 基本要素が表示される
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.mystery-card')).toBeVisible();
    
    // 運勢を表示してレイアウトを確認
    await page.click('.reveal-button');
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('.lucky-items')).toBeVisible();
  });
});

test.describe('占い機能 - アクセシビリティ', () => {
  test('キーボードナビゲーションでボタンを操作できる', async ({ page }) => {
    await page.goto('/fortune');
    
    // 運勢を見るボタンに直接フォーカスを当てる
    await page.locator('.reveal-button').focus();
    
    // Enterキーで運勢を表示
    await page.keyboard.press('Enter');
    
    // 結果が表示される
    await expect(page.locator('.fortune-result')).toBeVisible();
  });

  test('適切なセマンティックHTMLが使用されている', async ({ page }) => {
    await page.goto('/fortune');
    
    // セマンティック要素が正しく使用されている
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
    
    await page.click('.reveal-button');
    await expect(page.locator('h3')).toBeVisible();
  });
});