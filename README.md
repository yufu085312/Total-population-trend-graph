# フロントエンドコーディング試験
## 【課題】

**都道府県別の総人口推移グラフを表示するSPA(Single Page Application)を構築せよ**

**内容**

1. RESAS(地域経済分析システム) APIの「都道府県一覧」APIから取得する
2. APIレスポンスから都道府県一覧のチェックボックスを動的に生成する
3. 都道府県にチェックを入れると、RESAS APIから選択された都道府県の「人口構成」を取得する
4. 人口構成APIレスポンスから、X軸:年、Y軸:人口数の折れ線グラフを動的に生成して表示する

    a 「総人口」の他に「年少人口」「生産年齢人口」「老年人口」も切り替えるUIを何らかの形で用意し表示できるようにすること（同時に表示する必要はない）

## プロジェクトのセットアップ

- 必要なライブラリのインストール
```
npm install axios recharts
npm install @types/recharts --save-dev
npm install eslint prettier eslint-config-prettier eslint-plugin-prettier --save-dev
```

- 動作条件
.envファイルを作り、APIキーを設定する
```
REACT_APP_RESAS_API_KEY = APIキー
```

- ビルド
```
npm run build
```