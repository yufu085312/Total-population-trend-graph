import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchPrefectures } from "../services/ResasApiService";
import axios from "axios";

// Propsのインターフェース定義
interface Props {
    selectedPrefectures: number[]; // 選択された都道府県のコードの配列
}

// PopulationDataインターフェース
interface PopulationData {
    year: number; // 年度
    value: number; // 人口値
}

// 年度ごとに整理したデータのインターフェース
interface ChartData {
    year: string;
    [prefectureName: string]: number | string; // 都道府県名をキーにした人口数
}

// 人口構成データのカテゴリーを識別するための型
interface PopulationCompositionData {
    label: string; // データのラベル（"総人口"や"年少人口"など）
    data: PopulationData[]; // そのラベルに対応する人口データの配列
}

// グラフの種類を識別するenum
enum GraphType {
    Total = "total", // 総人口
    Young = "young" // 年少人口
}

const PopulationChart: React.FC<Props> = ({ selectedPrefectures }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]); // グラフに表示するデータ
    const [graphType, setGraphType] = useState<GraphType>(GraphType.Total); // 表示するグラフの種類
    const [prefectureNameMap, setPrefectureNameMap] = useState<{ [key: number]: string }>({}); // 都道府県コードと都道府県名のマッピング

    // 都道府県一覧を取得して、都道府県コードと都道府県名のマッピングを作成
    useEffect(() => {
        fetchPrefectures().then(prefectures => {
            const nameMap: { [key: number]: string } = {};
            prefectures.forEach(pref => {
                nameMap[pref.prefCode] = pref.prefName;
            });
            setPrefectureNameMap(nameMap);
        });
    }, []);

    // 選択された都道府県の人口構成データを取得して、グラフに表示するデータを設定
    useEffect(() => {
        const fetchData = async () => {
            const allData: ChartData[] = [];

            for (const prefCode of selectedPrefectures) {
                const endpoint = `population/composition/perYear?prefCode=${prefCode}`;
                const response = await axios.get(`https://opendata.resas-portal.go.jp/api/v1/${endpoint}`, {
                    headers: { "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY },
                });

                const targetData = graphType === GraphType.Young 
                    ? response.data.result.data.find((d: PopulationCompositionData) => d.label === "年少人口") 
                    : response.data.result.data.find((d: PopulationCompositionData) => d.label === "総人口");
                if (!targetData) continue;

                targetData.data.forEach((item: PopulationData) => {
                    const year = item.year.toString();
                    const existingEntry = allData.find(entry => entry.year === year);
                    const prefectureName = prefectureNameMap[prefCode];

                    if (existingEntry) {
                        existingEntry[prefectureName] = item.value;
                    } else {
                        allData.push({
                            year: year,
                            [prefectureName]: item.value,
                        });
                    }
                });
            }

            setChartData(allData);
        };

        if (selectedPrefectures.length > 0) {
            fetchData();
        }
    }, [selectedPrefectures, graphType, prefectureNameMap]);

    return (
        <div>
        <button onClick={() => setGraphType(GraphType.Total)}>総人口</button>
        <button onClick={() => setGraphType(GraphType.Young)}>年少人口</button>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedPrefectures.map((prefCode, index) => (
                    <Line
                        key={prefCode}
                        type="monotone"
                        dataKey={prefectureNameMap[prefCode]}
                        stroke={["#8884d8", "#82ca9d", "#ffc658"][index % selectedPrefectures.length]}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
};

export default PopulationChart;
