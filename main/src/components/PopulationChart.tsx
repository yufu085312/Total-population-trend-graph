import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchPrefectures } from "../services/ResasApiService";
import axios from "axios";

// Propsのインターフェース定義
interface Props {
    selectedPrefectures: number[];
}

// PopulationDataインターフェース
interface PopulationData {
    year: number; // 年度
    value: number; // 人口値
}

// 年度ごとに整理したデータのインターフェース
interface ChartData {
    year: string;
    [prefectureName: string]: number | string;
}

// 都道府県のインターフェース
interface Prefecture {
    prefCode: number;
    prefName: string;
}

const PopulationChart: React.FC<Props> = ({ selectedPrefectures }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]); // 都道府県一覧を保持するための状態

    // 都道府県一覧を取得
    useEffect(() => {
        const initializePrefectures = async () => {
            const fetchedPrefectures = await fetchPrefectures();
            setPrefectures(fetchedPrefectures);
        };
        initializePrefectures();
    }, []);

    // 人口データを取得し、チャートデータを設定
    useEffect(() => {
        const fetchData = async () => {
            if (prefectures.length === 0) return; // 都道府県一覧がまだない場合は処理をスキップ

            const allData: ChartData[] = [];
            const promises = selectedPrefectures.map(async (prefCode) => {
                const response = await axios.get(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`, {
                    headers: { "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY! },
                });

                response.data.result.data[0].data.forEach((data: PopulationData) => {
                    const existingEntry = allData.find(entry => entry.year === String(data.year));
                    const prefecture = prefectures.find(p => p.prefCode === prefCode);
                    const prefectureName = prefecture ? prefecture.prefName : `未知の都道府県(${prefCode})`;
                    if (existingEntry) {
                        existingEntry[prefectureName] = data.value;
                    } else {
                        allData.push({
                        year: String(data.year),
                        [prefectureName]: data.value,
                        });
                    }
                });
            });

            await Promise.all(promises);
            setChartData(allData.sort((a, b) => a.year.localeCompare(b.year)));
        };

        if (selectedPrefectures.length > 0) {
            fetchData();
        } else {
            setChartData([]);
        }
    }, [selectedPrefectures, prefectures]); // 都道府県一覧も依存関係に追加

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedPrefectures.map((prefCode, index) => {
                    const prefecture = prefectures.find(p => p.prefCode === prefCode);
                    const prefectureName = prefecture ? prefecture.prefName : `未知の都道府県(${prefCode})`;
                    return (
                        <Line
                            key={prefCode}
                            type="monotone"
                            dataKey={prefectureName}
                            stroke={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} // 色を循環させる
                            activeDot={{ r: 8 }}
                        />
                    );
                })}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PopulationChart;
