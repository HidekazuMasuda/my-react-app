# Create React App を使った開発

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) でブートストラップされました。

## 使用可能なスクリプト

プロジェクトディレクトリで以下のコマンドを実行できます：

### `npm start`

開発モードでアプリを実行します。\
ブラウザで [http://localhost:3000](http://localhost:3000) を開いて表示できます。

変更を行うとページが自動的にリロードされます。\
コンソールにリントエラーも表示されます。

### `npm test`

Reactのユニットテストをインタラクティブなウォッチモードで起動します。\
詳細については、[テスト実行](https://facebook.github.io/create-react-app/docs/running-tests)のセクションを参照してください。

### `npx playwright test`

PlaywrightによるE2Eテストを実行します。\
アプリケーションの機能全体をブラウザ上で自動テストします。

#### E2Eテストの詳細

- **基本機能テスト**: TODOの追加、削除、完了切り替えなど（9テスト）
- **期限日機能テスト**: カレンダー・手動入力、期限切れハイライトなど（8テスト）
- **永続化テスト**: localStorage保存、リロード後の保持など（9テスト）

```bash
# 全テストを実行
npx playwright test

# 特定のテストファイルのみ実行
npx playwright test tests/todo-app.spec.js
npx playwright test tests/todo-due-date.spec.js
npx playwright test tests/todo-persistence.spec.js

# テスト結果のHTMLレポートを表示
npx playwright show-report
```

### 受け入れテスト

#### 自然言語による受け入れテスト

利用者のユースケースの立場で自然言語的にテストを記述した受け入れテストも導入されています：

```bash
# 自然言語受け入れテスト
npm run test:acceptance

# ユーザージャーニーテスト
npm run test:journey

# 全テスト（E2E + 受け入れ + ジャーニー）
npm run test:all

# 品質チェック + 全テスト
npm run test:full
```

#### 受け入れテストの特徴

- **自然言語アプローチ**: テストが読みやすく、非技術者でも理解できる
- **ユーザーシナリオベース**: 実際の利用者の行動パターンに基づく
- **包括的カバレッジ**: 新規ユーザーからエキスパートユーザーまで
- **エラーケース考慮**: 過去日付入力などのエラーハンドリングもテスト

詳細は `tests/acceptance/README.md` を参照してください。

**注意**: 全てのテストを実行する前に、開発サーバー（`npm start`）が http://localhost:3000 で起動している必要があります。

### `npm run build`

本番用のアプリを `build` フォルダにビルドします。\
本番モードでReactを正しくバンドルし、最高のパフォーマンスのためにビルドを最適化します。

ビルドは圧縮され、ファイル名にはハッシュが含まれます。\
アプリはデプロイ準備完了です！

詳細については、[デプロイメント](https://facebook.github.io/create-react-app/docs/deployment)のセクションを参照してください。

### `npm run eject`

**注意: これは一方向の操作です。一度 `eject` すると元に戻せません！**

ビルドツールと設定の選択に満足できない場合は、いつでも `eject` できます。このコマンドは、プロジェクトから単一のビルド依存関係を削除します。

代わりに、すべての設定ファイルと推移的依存関係（webpack、Babel、ESLintなど）をプロジェクトに直接コピーし、完全にコントロールできるようにします。`eject` 以外のすべてのコマンドは引き続き動作しますが、コピーされたスクリプトを指すため、調整できます。この時点で自己責任となります。

`eject` を使用する必要はありません。厳選された機能セットは小規模から中規模のデプロイメントに適しており、この機能を使用する義務はありません。ただし、準備ができたときにカスタマイズできなければ、このツールは有用ではないと理解しています。

## 詳細情報

[Create React App ドキュメント](https://facebook.github.io/create-react-app/docs/getting-started)で詳細を学べます。

Reactを学ぶには、[React ドキュメント](https://reactjs.org/)をチェックしてください。

### コード分割

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### バンドルサイズの分析

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Progressive Web App の作成

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### 高度な設定

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### デプロイメント

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` の圧縮失敗

このセクションは移動しました: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
