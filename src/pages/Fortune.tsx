/* eslint-disable security/detect-object-injection */
import React, { useState, useEffect, useCallback } from 'react';
import './Fortune.css';

interface FortuneResult {
  fortune: string;
  description: string;
  luckyItems: string[];
  color: string;
}

// 運勢の種類と説明
const FORTUNES = [
  {
    fortune: '大吉',
    description:
      '素晴らしい一日になりそうです！何事も積極的に挑戦してみましょう。',
    color: '#ff6b6b',
  },
  {
    fortune: '中吉',
    description:
      '良いことが起こりそうな予感です。チャンスを逃さないようにしましょう。',
    color: '#ff9f43',
  },
  {
    fortune: '小吉',
    description:
      '小さな幸せが見つかる日です。身の回りの変化に注目してみてください。',
    color: '#feca57',
  },
  {
    fortune: '吉',
    description:
      '平穏で安定した一日になりそうです。計画的に物事を進めましょう。',
    color: '#48dbfb',
  },
  {
    fortune: '末吉',
    description: '後半に向けて運気が上昇してきます。諦めずに頑張りましょう。',
    color: '#0abde3',
  },
  {
    fortune: '凶',
    description: '慎重に行動することで困難を乗り越えられます。無理は禁物です。',
    color: '#c8d6e5',
  },
];

// ラッキーアイテムの絵文字リスト
const LUCKY_ITEM_EMOJIS = [
  '🍀',
  '💎',
  '🌟',
  '🎯',
  '🗝️',
  '📿',
  '🔮',
  '💰',
  '🎪',
  '🎭',
  '🎨',
  '🎵',
  '📚',
  '✨',
  '🌙',
  '☀️',
  '🦋',
  '🐞',
  '🌈',
  '🎈',
  '🎁',
  '🏆',
  '👑',
  '💝',
  '🧿',
  '🪬',
  '🌸',
  '🌺',
  '🍒',
  '🍊',
  '🥇',
  '⭐',
];

const Fortune: React.FC = () => {
  const [todaysFortune, setTodaysFortune] = useState<FortuneResult | null>(
    null
  );
  const [isRevealed, setIsRevealed] = useState(false);

  // 日付ベースのシード値を生成
  const generateSeed = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return year * 10000 + month * 100 + day;
  };

  // シード値ベースの疑似乱数生成
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 今日の運勢を生成
  const generateTodaysFortune = useCallback((): FortuneResult => {
    const today = new Date();
    const seed = generateSeed(today);

    // 運勢を選択
    const fortuneIndex = Math.floor(seededRandom(seed) * FORTUNES.length);
    // eslint-disable-next-line security/detect-object-injection
    const selectedFortune = FORTUNES[fortuneIndex];

    // ラッキーアイテムを2つ選択
    const item1Index = Math.floor(
      seededRandom(seed + 1) * LUCKY_ITEM_EMOJIS.length
    );
    let item2Index = Math.floor(
      seededRandom(seed + 2) * LUCKY_ITEM_EMOJIS.length
    );

    // 同じアイテムが選ばれないようにする
    while (item2Index === item1Index) {
      item2Index = (item2Index + 1) % LUCKY_ITEM_EMOJIS.length;
    }

    return {
      fortune: selectedFortune.fortune,
      description: selectedFortune.description,
      luckyItems: [
        LUCKY_ITEM_EMOJIS[item1Index],
        LUCKY_ITEM_EMOJIS[item2Index],
      ],
      color: selectedFortune.color,
    };
  }, []);

  useEffect(() => {
    setTodaysFortune(generateTodaysFortune());
  }, [generateTodaysFortune]);

  const handleRevealFortune = () => {
    setIsRevealed(true);
  };

  const handleResetFortune = () => {
    setIsRevealed(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (!todaysFortune) {
    return <div className="fortune-loading">占いを準備中...</div>;
  }

  return (
    <div className="fortune-container">
      <header className="fortune-header">
        <h1 className="fortune-title">🔮 今日の運勢占い</h1>
        <p className="fortune-date">{formatDate(new Date())}</p>
      </header>

      <main className="fortune-content">
        {!isRevealed ? (
          <div className="fortune-mystery">
            <div className="mystery-card">
              <div className="mystery-symbol">🎴</div>
              <h2>今日のあなたの運勢は？</h2>
              <p>カードをクリックして運勢を確認しましょう</p>
              <button className="reveal-button" onClick={handleRevealFortune}>
                運勢を見る
              </button>
            </div>
          </div>
        ) : (
          <div className="fortune-result">
            <div
              className="fortune-card"
              style={{ borderColor: todaysFortune.color }}
            >
              <div
                className="fortune-badge"
                style={{ backgroundColor: todaysFortune.color }}
              >
                {todaysFortune.fortune}
              </div>
              <div className="fortune-description">
                {todaysFortune.description}
              </div>
            </div>

            <div className="lucky-items-section">
              <h3>✨ 本日のラッキーアイテム ✨</h3>
              <div className="lucky-items">
                {todaysFortune.luckyItems.map((item, index) => (
                  <div key={index} className="lucky-item">
                    <span className="lucky-item-emoji">{item}</span>
                    <span className="lucky-item-label">
                      ラッキーアイテム {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fortune-actions">
              <button className="reset-button" onClick={handleResetFortune}>
                もう一度見る
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fortune-footer">
        <p>
          ※
          占い結果は娯楽目的です。一日を楽しく過ごすきっかけとしてお楽しみください。
        </p>
      </footer>
    </div>
  );
};

export default Fortune;
