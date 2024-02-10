import React, { useEffect, useState } from "react";
import { fetchPrefectures } from "../services/ResasApiService";

interface Prefecture {
    prefCode: number; // 都道府県コード
    prefName: string; // 都道府県名
}

// コンポーネントに渡されるプロパティの型を定義するインターフェース
interface Props {
    // 都道府県の選択状態が変更された時に呼び出されるコールバック関数
    onPrefectureChange: (selectedPrefectures: number[]) => void;
}

const PrefectureCheckboxList: React.FC<Props> = ({ onPrefectureChange }) => {
    // APIから取得した都道府県の一覧を保持するための状態変数
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    // ユーザーによって選択された都道府県のコードを保持するための状態変数
    const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);

    useEffect(() => {
        // fetchPrefectures関数を呼び出して都道府県一覧を取得
        const initializePrefectures = async () => {
            const fetchedPrefectures = await fetchPrefectures();
            setPrefectures(fetchedPrefectures);
        };

        initializePrefectures();
    }, []);

    //  チェックボックスの状態が変更された時に呼び出される関数
    const handleCheckboxChange = (prefCode: number) => {
        const newSelectedPrefectures = selectedPrefectures.includes(prefCode)
            ? selectedPrefectures.filter(code => code !== prefCode)
            : [...selectedPrefectures, prefCode];
        setSelectedPrefectures(newSelectedPrefectures);
        onPrefectureChange(newSelectedPrefectures);
    };

    return (
        <div>
            {prefectures.map(prefecture => (
                <label key={prefecture.prefCode}>
                    <input
                        type="checkbox"
                        checked={selectedPrefectures.includes(prefecture.prefCode)}
                        onChange={() => handleCheckboxChange(prefecture.prefCode)}
                    />
                    {prefecture.prefName}
                </label>
            ))}
        </div>
    );
};

export default PrefectureCheckboxList;
