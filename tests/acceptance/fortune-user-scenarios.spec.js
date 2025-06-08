/**
 * 占い機能 - ユーザー受入テスト（UAT: User Acceptance Test）
 * 
 * 実際のユーザーの立場から、ビジネス要件を満たすかを検証するテストシナリオ
 * 利用者の様々な利用シーンをカバーし、期待される価値が提供されることを確認
 */

const { test, expect } = require('@playwright/test');

test.describe('占い機能 - ユーザー受入テスト', () => {
  test.beforeEach(async ({ page }) => {
    // 占いページに移動
    await page.goto('/fortune');
  });

  test('受入シナリオ1: 朝の通勤時間に今日の運勢を確認する会社員', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 会社員のAさんは、毎朝通勤電車の中でスマートフォンから今日の運勢をチェックして、
     * 一日を前向きに始めたいと思っている。操作は簡単で、すぐに結果が見られることを期待している。
     */
    
    // Given: 朝の通勤時間、スマートフォンでアクセス
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE サイズ
    
    // When: 占いページにアクセスする
    await expect(page.locator('h1')).toContainText('🔮 今日の運勢占い');
    await expect(page.locator('.fortune-date')).toBeVisible();
    
    // Then: 今日の日付が表示され、分かりやすいインターフェースが提供される
    const dateText = await page.locator('.fortune-date').textContent();
    expect(dateText).toContain('2025年');
    expect(dateText).toContain('月');
    expect(dateText).toContain('日');
    
    // When: 「運勢を見る」ボタンをタップする
    await page.click('.reveal-button');
    
    // Then: すぐに運勢結果が表示され、分かりやすい内容が提示される
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('.fortune-badge')).toBeVisible();
    await expect(page.locator('.fortune-description')).toBeVisible();
    
    // And: 今日のラッキーアイテムが2つ表示される
    await expect(page.locator('.lucky-item')).toHaveCount(2);
    await expect(page.locator('h3')).toContainText('✨ 本日のラッキーアイテム ✨');
    
    // And: 結果を再確認できるリセット機能がある
    await expect(page.locator('.reset-button')).toContainText('もう一度見る');
    
    // 価値検証: 一日のモチベーション向上につながる情報が提供される
    const description = await page.locator('.fortune-description').textContent();
    expect(description.length).toBeGreaterThan(20); // 十分な説明文
    expect(description).toMatch(/。/); // 日本語の文章形式
  });

  test('受入シナリオ2: ランチタイムに友人と占い結果をシェアする学生', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 大学生のBさんは、友人とのランチタイムに占い結果を見せ合って盛り上がりたい。
     * 視覚的に魅力的で、友人に見せやすいデザインであることを期待している。
     */
    
    // Given: ランチタイム、タブレットサイズの画面で友人と共有
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad サイズ
    
    // When: 占い結果を表示する
    await page.click('.reveal-button');
    
    // Then: 視覚的に魅力的な結果が表示される
    await expect(page.locator('.fortune-card')).toBeVisible();
    
    // And: 運勢に応じた色付きのバッジが表示される
    const fortuneBadge = page.locator('.fortune-badge');
    await expect(fortuneBadge).toBeVisible();
    await expect(fortuneBadge).toHaveCSS('background-color', /.+/);
    
    // And: 可愛い絵文字のラッキーアイテムが表示される
    const luckyItems = page.locator('.lucky-item-emoji');
    await expect(luckyItems).toHaveCount(2);
    
    const item1 = await luckyItems.first().textContent();
    const item2 = await luckyItems.last().textContent();
    
    // 絵文字が適切に表示されることを確認
    expect(item1).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    expect(item2).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    expect(item1).not.toBe(item2); // 異なるアイテム
    
    // 価値検証: 友人との会話のきっかけになる魅力的なコンテンツ
    await expect(page.locator('.fortune-description')).toBeVisible();
    await expect(page.locator('.lucky-items-section')).toBeVisible();
  });

  test('受入シナリオ3: 寝る前のリラックスタイムに占いで一日を振り返る主婦', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 主婦のCさんは、子供を寝かしつけた後のリラックスタイムに、
     * 今日の運勢を見て一日を振り返り、明日への気持ちを整えたい。
     * 落ち着いたデザインで、ゆっくりと内容を読めることを期待している。
     */
    
    // Given: 夜のリラックスタイム、デスクトップ画面でゆっくり鑑賞
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // When: 占いページを開いて、ゆっくりと内容を確認する
    await expect(page.locator('.fortune-header')).toBeVisible();
    
    // Then: 落ち着いたデザインで今日の日付が確認できる
    await expect(page.locator('.fortune-title')).toContainText('🔮 今日の運勢占い');
    await expect(page.locator('.fortune-date')).toBeVisible();
    
    // When: 運勢を表示する
    await page.click('.reveal-button');
    
    // Then: アニメーションとともに結果が美しく表示される
    await expect(page.locator('.fortune-card')).toHaveCSS('animation-name', 'slideIn');
    
    // And: 十分な説明文で運勢の詳細が提供される
    const description = await page.locator('.fortune-description').textContent();
    expect(description.length).toBeGreaterThan(30);
    expect(description).toMatch(/[。！]/); // 適切な句読点
    
    // And: 免責事項が明確に表示される
    await expect(page.locator('.fortune-footer')).toContainText('占い結果は娯楽目的です');
    await expect(page.locator('.fortune-footer')).toContainText('一日を楽しく過ごすきっかけとしてお楽しみください');
    
    // When: 結果をリセットして再度確認する
    await page.click('.reset-button');
    await expect(page.locator('.mystery-card')).toBeVisible();
    
    // And: 同じ結果が再現される（一貫性の確認）
    await page.click('.reveal-button');
    const secondDescription = await page.locator('.fortune-description').textContent();
    expect(secondDescription).toBe(description);
    
    // 価値検証: 心の安らぎと明日への前向きな気持ちを提供
    await expect(page.locator('.fortune-result')).toBeVisible();
  });

  test('受入シナリオ4: 初回訪問者が占い機能を直感的に理解して利用する', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 初めてサイトを訪れたDさんは、ナビゲーションから占い機能を見つけて、
     * 説明を読まなくても直感的に使い方が分かることを期待している。
     */
    
    // Given: 初回訪問者がホームページから開始
    await page.goto('/');
    
    // When: ナビゲーションで占い機能を発見する
    await expect(page.locator('a[href="/fortune"]')).toBeVisible();
    await expect(page.locator('a[href="/fortune"]')).toContainText('🔮 占い');
    
    // And: 占いリンクをクリックする
    await page.click('a[href="/fortune"]');
    
    // Then: 占いページに移動し、使い方が直感的に理解できる
    await expect(page).toHaveURL(/.*\/fortune/);
    await expect(page.locator('h2')).toContainText('今日のあなたの運勢は？');
    await expect(page.locator('.mystery-card p')).toContainText('カードをクリックして運勢を確認しましょう');
    
    // When: 指示に従ってボタンをクリックする
    await expect(page.locator('.reveal-button')).toBeVisible();
    await page.click('.reveal-button');
    
    // Then: 期待通りの結果が表示される
    await expect(page.locator('.fortune-result')).toBeVisible();
    
    // 価値検証: ユーザビリティが高く、初回利用者でも迷わない
    await expect(page.locator('.fortune-badge')).toBeVisible();
    await expect(page.locator('.lucky-items-section')).toBeVisible();
    await expect(page.locator('.reset-button')).toBeVisible();
  });

  test('受入シナリオ5: 毎日利用するリピーターが一貫した体験を得る', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 毎日占いをチェックするリピーターのEさんは、
     * 同じ日は常に同じ結果が得られ、異なる日は異なる結果が得られることを期待している。
     */
    
    // Given: リピーターユーザーが日々の習慣として利用
    
    // When: 今日の運勢を複数回確認する
    await page.click('.reveal-button');
    
    const firstFortune = await page.locator('.fortune-badge').textContent();
    const firstItem1 = await page.locator('.lucky-item').first().locator('.lucky-item-emoji').textContent();
    const firstItem2 = await page.locator('.lucky-item').last().locator('.lucky-item-emoji').textContent();
    const firstDescription = await page.locator('.fortune-description').textContent();
    
    // And: リセットして再度確認する
    await page.click('.reset-button');
    await page.click('.reveal-button');
    
    const secondFortune = await page.locator('.fortune-badge').textContent();
    const secondItem1 = await page.locator('.lucky-item').first().locator('.lucky-item-emoji').textContent();
    const secondItem2 = await page.locator('.lucky-item').last().locator('.lucky-item-emoji').textContent();
    const secondDescription = await page.locator('.fortune-description').textContent();
    
    // Then: 同日は必ず同じ結果が得られる（一貫性）
    expect(firstFortune).toBe(secondFortune);
    expect(firstItem1).toBe(secondItem1);
    expect(firstItem2).toBe(secondItem2);
    expect(firstDescription).toBe(secondDescription);
    
    // And: 運勢の種類が適切な範囲にある
    expect(['大吉', '中吉', '小吉', '吉', '末吉', '凶']).toContain(firstFortune);
    
    // 価値検証: 信頼性と一貫性のある占い体験
    await expect(page.locator('.fortune-result')).toBeVisible();
  });

  test('受入シナリオ6: アクセシビリティを重視するユーザーが支援技術で利用する', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 視覚に障がいのあるFさんは、スクリーンリーダーやキーボード操作で
     * 占い機能を利用したいと考えている。適切なセマンティック構造であることを期待している。
     */
    
    // Given: キーボードとスクリーンリーダーでの利用を想定
    
    // Then: 適切なヘッダー構造が提供される
    await expect(page.locator('h1')).toBeVisible(); // メインタイトル
    await expect(page.locator('h2')).toBeVisible(); // セクションタイトル
    
    // And: セマンティック要素が正しく使用される
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // When: キーボードでボタンを操作する
    await page.locator('.reveal-button').focus();
    await page.keyboard.press('Enter');
    
    // Then: 結果が表示され、適切な構造が維持される
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible(); // ラッキーアイテムセクション
    
    // And: リセットボタンもキーボードで操作可能
    await page.locator('.reset-button').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mystery-card')).toBeVisible();
    
    // 価値検証: すべてのユーザーがアクセス可能な包括的な設計
  });

  test('受入シナリオ7: 企業の福利厚生として従業員の心の健康をサポート', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 企業の人事担当者は、従業員の心の健康とモチベーション向上のために、
     * 占い機能が適切で建設的なコンテンツを提供することを確認したい。
     */
    
    // Given: 企業環境での利用を想定
    
    // When: 占い結果を表示する
    await page.click('.reveal-button');
    
    // Then: すべての運勢タイプが前向きまたは建設的な内容である
    const fortune = await page.locator('.fortune-badge').textContent();
    const description = await page.locator('.fortune-description').textContent();
    
    // 各運勢タイプの適切性を確認
    if (fortune === '大吉') {
      expect(description).toMatch(/積極的|挑戦|素晴らしい/);
    } else if (fortune === '中吉') {
      expect(description).toMatch(/良い|チャンス/);
    } else if (fortune === '小吉') {
      expect(description).toMatch(/幸せ|変化|注目/);
    } else if (fortune === '吉') {
      expect(description).toMatch(/平穏|安定|計画/);
    } else if (fortune === '末吉') {
      expect(description).toMatch(/上昇|頑張|諦めず/);
    } else if (fortune === '凶') {
      expect(description).toMatch(/慎重|乗り越え|無理は禁物/);
    }
    
    // And: 適切な免責事項が表示される
    await expect(page.locator('.fortune-footer')).toContainText('娯楽目的');
    await expect(page.locator('.fortune-footer')).toContainText('楽しく過ごすきっかけ');
    
    // And: ハラスメントや差別的な内容が含まれていない
    expect(description).not.toMatch(/死|病気|事故|災害/);
    expect(description).not.toMatch(/絶望|最悪|ダメ|失敗/);
    
    // 価値検証: 従業員の心理的安全性を保ちながら楽しみを提供
    expect(description.length).toBeGreaterThan(10);
  });

  test('受入シナリオ8: 多言語環境でも日本語フォントが正しく表示される', async ({ page }) => {
    /**
     * ユーザーストーリー:
     * 海外在住の日本人Gさんは、現地のデバイスでも
     * 日本語が正しく表示され、絵文字も適切に表示されることを期待している。
     */
    
    // Given: 多言語環境での利用を想定
    
    // When: 占いページを表示する
    // Then: 日本語テキストが正しく表示される
    await expect(page.locator('h1')).toContainText('今日の運勢占い');
    
    const dateText = await page.locator('.fortune-date').textContent();
    expect(dateText).toMatch(/年.*月.*日/);
    
    // When: 運勢を表示する
    await page.click('.reveal-button');
    
    // Then: 日本語の説明文が正しく表示される
    const description = await page.locator('.fortune-description').textContent();
    expect(description).toMatch(/です|ます|でしょう/); // 敬語の確認
    
    // And: 絵文字が正しく表示される
    const luckyItems = page.locator('.lucky-item-emoji');
    const item1 = await luckyItems.first().textContent();
    const item2 = await luckyItems.last().textContent();
    
    // Unicode絵文字として認識される
    expect(item1).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    expect(item2).toMatch(/[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    
    // 価値検証: グローバルな日本語ユーザーへの配慮
    await expect(page.locator('.lucky-item-label').first()).toContainText('ラッキーアイテム');
  });
});

test.describe('占い機能 - ビジネス要件満足度テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fortune');
  });

  test('要件1: エンターテイメント価値の提供', async ({ page }) => {
    /**
     * ビジネス要件: ユーザーに楽しく魅力的なエンターテイメント体験を提供する
     */
    
    // Given: エンターテイメント価値の検証
    await page.click('.reveal-button');
    
    // Then: 視覚的に魅力的な要素が含まれる（運勢表示前はミステリーカードはない）
    await expect(page.locator('.fortune-title')).toContainText('🔮');
    
    // 運勢を表示してからh3要素を確認
    await expect(page.locator('h3')).toContainText('✨');
    
    // And: アニメーション効果がある
    await expect(page.locator('.fortune-card')).toHaveCSS('animation-name', 'slideIn');
    
    // And: インタラクティブな要素がある
    await expect(page.locator('.reset-button')).toBeVisible();
    await page.click('.reset-button');
    await expect(page.locator('.mystery-card')).toBeVisible();
  });

  test('要件2: 日次利用促進のための一意性', async ({ page }) => {
    /**
     * ビジネス要件: 同じ日は同じ結果、異なる日は異なる結果により日次利用を促進
     */
    
    // Then: 日付ベースの一意性が保証される
    await page.click('.reveal-button');
    const result1 = await page.locator('.fortune-badge').textContent();
    
    await page.click('.reset-button');
    await page.click('.reveal-button');
    const result2 = await page.locator('.fortune-badge').textContent();
    
    expect(result1).toBe(result2); // 同日同結果
  });

  test('要件3: ユーザビリティと直感的操作', async ({ page }) => {
    /**
     * ビジネス要件: 説明不要で直感的に操作できるユーザーインターフェース
     */
    
    // Then: 明確な行動指示がある
    await expect(page.locator('.mystery-card p')).toContainText('クリックして運勢を確認');
    
    // And: ボタンが明確に識別できる
    await expect(page.locator('.reveal-button')).toContainText('運勢を見る');
    
    // And: 操作に対する即座のフィードバックがある
    await page.click('.reveal-button');
    await expect(page.locator('.fortune-result')).toBeVisible();
  });

  test('要件4: モバイルファーストデザイン', async ({ page }) => {
    /**
     * ビジネス要件: スマートフォンでの利用を最優先とした設計
     */
    
    // Given: モバイルサイズでの利用
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5/SE
    
    // Then: レイアウトが適切に表示される
    await expect(page.locator('.fortune-container')).toBeVisible();
    await expect(page.locator('.mystery-card')).toBeVisible();
    
    await page.click('.reveal-button');
    await expect(page.locator('.fortune-result')).toBeVisible();
    await expect(page.locator('.lucky-items')).toBeVisible();
  });

  test('要件5: 心理的安全性とポジティブ体験', async ({ page }) => {
    /**
     * ビジネス要件: ユーザーの心理的安全性を保ち、ポジティブな体験を提供
     */
    
    await page.click('.reveal-button');
    const description = await page.locator('.fortune-description').textContent();
    
    // Then: 建設的で前向きな内容である
    expect(description).not.toMatch(/危険|不幸|災い|悪い|最悪/);
    
    // And: 適切な免責事項がある
    await expect(page.locator('.fortune-footer')).toContainText('娯楽目的');
    
    // And: 説明文が適切な長さである
    expect(description.length).toBeGreaterThan(20);
    expect(description.length).toBeLessThan(150);
  });
});