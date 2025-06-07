#!/usr/bin/env node
/**
 * 全テスト実行スクリプト
 * 既存のE2Eテストと新しい受け入れテストを統合して実行
 */

const { spawn } = require('child_process');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = [];
    this.totalPassed = 0;
    this.totalFailed = 0;
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`\n🚀 実行中: ${command} ${args.join(' ')}`);
      
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${command} ${args.join(' ')} - 成功`);
          resolve(code);
        } else {
          console.log(`❌ ${command} ${args.join(' ')} - 失敗 (終了コード: ${code})`);
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        console.error(`❌ ${command} 実行エラー:`, error);
        reject(error);
      });
    });
  }

  async checkServerRunning() {
    try {
      const http = require('http');
      return new Promise((resolve) => {
        const req = http.get('http://localhost:3000', (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
          req.destroy();
          resolve(false);
        });
      });
    } catch (error) {
      return false;
    }
  }

  async waitForServer(maxAttempts = 30) {
    console.log('🔍 開発サーバーの起動を確認中...');
    
    for (let i = 0; i < maxAttempts; i++) {
      if (await this.checkServerRunning()) {
        console.log('✅ 開発サーバーが起動しました');
        return true;
      }
      
      console.log(`⏳ サーバー起動を待機中... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('開発サーバーの起動がタイムアウトしました');
  }

  async runTestSuite(testName, command, args = []) {
    const startTime = Date.now();
    
    try {
      await this.runCommand(command, args);
      const duration = Date.now() - startTime;
      this.results.push({
        name: testName,
        status: 'PASS',
        duration: Math.round(duration / 1000),
        error: null
      });
      this.totalPassed++;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        name: testName,
        status: 'FAIL',
        duration: Math.round(duration / 1000),
        error: error.message
      });
      this.totalFailed++;
    }
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 テスト結果サマリー');
    console.log('='.repeat(60));
    
    this.results.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅' : '❌';
      const durationText = `(${result.duration}秒)`;
      
      console.log(`${statusIcon} ${result.name} ${durationText}`);
      
      if (result.error) {
        console.log(`   エラー: ${result.error}`);
      }
    });
    
    console.log('\n' + '-'.repeat(40));
    console.log(`総テストスイート数: ${this.results.length}`);
    console.log(`成功: ${this.totalPassed}`);
    console.log(`失敗: ${this.totalFailed}`);
    
    const totalTests = this.totalPassed + this.totalFailed;
    const successRate = totalTests > 0 ? Math.round((this.totalPassed / totalTests) * 100) : 0;
    console.log(`成功率: ${successRate}%`);
    
    if (this.totalFailed === 0) {
      console.log('\n🎉 すべてのテストが成功しました！');
    } else {
      console.log('\n⚠️  一部のテストが失敗しました');
    }
    
    console.log('='.repeat(60));
    
    return this.totalFailed === 0;
  }

  async runAllTests() {
    console.log('🧪 全テストスイート実行開始');
    console.log('対象: E2Eテスト + 受け入れテスト + ユーザージャーニーテスト');
    
    try {
      // サーバーが起動しているか確認
      await this.waitForServer();
      
      // 1. 既存のE2Eテスト（Playwright）
      console.log('\n📋 Step 1: 既存のE2Eテスト実行');
      await this.runTestSuite(
        'E2Eテスト (Playwright)', 
        'npx', 
        ['playwright', 'test']
      );
      
      // 2. 自然言語受け入れテスト
      console.log('\n📋 Step 2: 自然言語受け入れテスト実行');
      await this.runTestSuite(
        '自然言語受け入れテスト', 
        'node', 
        ['tests/acceptance/natural-language-tests.js']
      );
      
      // 3. ユーザージャーニーテスト
      console.log('\n📋 Step 3: ユーザージャーニーテスト実行');
      await this.runTestSuite(
        'ユーザージャーニーテスト', 
        'node', 
        ['tests/acceptance/user-journey-tests.js']
      );
      
    } catch (error) {
      console.error('\n❌ テスト実行中に予期しないエラーが発生しました:', error);
    }
    
    // 結果を表示
    const allPassed = this.displayResults();
    
    // 終了コードを設定
    process.exit(allPassed ? 0 : 1);
  }
}

// コマンドライン引数の処理
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
使用方法: node run-all-tests.js [オプション]

オプション:
  --help, -h     このヘルプを表示
  
実行されるテスト:
  1. E2Eテスト (Playwright)
  2. 自然言語受け入れテスト
  3. ユーザージャーニーテスト

前提条件:
  - 開発サーバーが http://localhost:3000 で起動していること
  - 必要な依存関係がインストールされていること
  `);
  process.exit(0);
}

// メイン実行
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('❌ テストランナーでエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = { TestRunner };