import React, { useState } from 'react';
import './App.css';
import PrefectureCheckboxList from './components/PrefectureCheckboxList';
import PopulationChart from './components/PopulationChart';

const App: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);

  // 選択された都道府県のコードの配列を更新する関数
  const handlePrefectureChange = (newSelectedPrefectures: number[]) => {
    // 選択された都道府県のコードを保持する状態変数
    setSelectedPrefectures(newSelectedPrefectures);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>都道府県別の総人口推移グラフ</h1>
      </header>
      <main>
        {/* 都道府県一覧のチェックボックスを表示するコンポーネント */}
        <PrefectureCheckboxList onPrefectureChange={handlePrefectureChange} />
        {/* 選択された都道府県の人口構成データを表示するグラフ */}
        <PopulationChart selectedPrefectures={selectedPrefectures} />
      </main>
    </div>
  );
};

export default App;
