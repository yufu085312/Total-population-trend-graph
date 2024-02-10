import React, { useEffect, useState } from "react";
// グラフ描画
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Propsのインターフェース定義を追加
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

// 都道府県コードを都道府県名に変換する仮の関数（実際にはAPIから都道府県名を取得する）
const getPrefectureName = (prefCode: number): string => `都道府県${prefCode}`;

const PopulationChart: React.FC<Props> = ({ selectedPrefectures }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    useEffect(() => {
    const fetchData = async () => {
        const allData: ChartData[] = [];
        const promises = selectedPrefectures.map(async (prefCode) => {
        const response = await axios.get(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`, {
            headers: { "X-API-KEY": process.env.REACT_APP_RESAS_API_KEY! },
        });
        response.data.result.data[0].data.forEach((data: PopulationData) => {
            const existingEntry = allData.find(entry => entry.year === String(data.year));
            const prefectureName = getPrefectureName(prefCode);
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
    }, [selectedPrefectures]);

    return (
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
                    dataKey={getPrefectureName(prefCode)}
                    stroke={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} // 色を循環させる
                    activeDot={{ r: 8 }}
                />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PopulationChart;
