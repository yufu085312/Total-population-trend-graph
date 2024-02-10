import axios from "axios";

// RESAS APIのエンドポイントURL
const RESAS_API_URL = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

// RESAS APIキーの環境変数名
const RESAS_API_KEY = process.env.REACT_APP_RESAS_API_KEY;

// 都道府県一覧の型定義
interface Prefecture {
    prefCode: number;
    prefName: string;
}

// 都道府県一覧を取得する関数
export const fetchPrefectures = async (): Promise<Prefecture[]> => {
    try {
        // axiosを使用してRESAS APIから都道府県一覧を取得
        const response = await axios.get(RESAS_API_URL, {
            headers: {
                "X-API-KEY": RESAS_API_KEY!, // 環境変数からAPIキーを取得
            },
        });
        // レスポンスから都道府県一覧データを抽出して返す
        return response.data.result;
    } catch (error) {
        // エラーが発生した場合は空の配列を返すか、エラーハンドリングを行う
        console.error("Error fetching prefectures:", error);
        throw error; // または適切なエラーハンドリングを実装
    }
};
