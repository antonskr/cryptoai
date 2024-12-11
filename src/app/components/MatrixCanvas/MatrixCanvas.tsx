"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./MatrixCanvas.module.scss";

// Генерация случайного адреса кошелька
const generateRandomWalletAddress = () => {
  const characters =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = "1";
  for (let i = 0; i < 33; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return address;
};

// Генерация случайной сид фразы
const generateRandomSeedPhrase = () => {
  const words = [
    "abandon",
    "ability",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
    "account",
    "accuse",
    "achieve",
    "acid",
    "acquire",
    "across",
    "act",
    "action",
    "actor",
  ];
  const phrase = [];
  for (let i = 0; i < 12; i++) {
    phrase.push(words[Math.floor(Math.random() * words.length)]);
  }
  return phrase.join(" ");
};

// Генерация случайной строки для кошелька
const generateRandomWalletData = () => {
  const address = generateRandomWalletAddress();
  const seedPhrase = generateRandomSeedPhrase();
  return {
    address,
    seedPhrase,
    unlocked: Math.random() > 0.99,
    balance: Math.random() * 1,
    timestamp: new Date().toLocaleTimeString(), // Метка времени
  };
};

const MatrixCanvas = () => {
  const [wallets, setWallets] = useState<
    {
      address: string;
      seedPhrase: string;
      unlocked: boolean;
      balance: number;
      timestamp: string;
    }[]
  >([]);
  const [speed, setSpeed] = useState(10); // Скорость
  const [isAnimating, setIsAnimating] = useState(true); // Состояние анимации
  const [chartType, setChartType] = useState("line"); // Тип графика

  const chartDataRef = useRef<number[]>([]); // Данные для графика
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ссылка на canvas

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAnimating) {
        setWallets((prevWallets) => {
          const newWallet = generateRandomWalletData();
          const updatedWallets = [...prevWallets, newWallet];
          if (updatedWallets.length > 20) {
            updatedWallets.shift(); // Удаляем старые кошельки
          }
          return updatedWallets;
        });
      }
    }, 1000 / speed);

    return () => {
      clearInterval(intervalId); // Очистка интервала
    };
  }, [isAnimating, speed]);

  useEffect(() => {
    const chartInterval = setInterval(() => {
      if (isAnimating) {
        const newHeight = speed; // Теперь высота графика зависит от скорости
        const updatedData = [...chartDataRef.current, newHeight];
        if (updatedData.length > 10) {
          updatedData.shift(); // Удаляем старые значения
        }
        chartDataRef.current = updatedData; // Обновляем реф

        drawChart(); // Перерисовываем график
      }
    }, 500);

    return () => {
      clearInterval(chartInterval);
    };
  }, [isAnimating, speed]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Настройки canvas
    canvas.width = 300;
    canvas.height = 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartType === "line") {
      // Линейный график
      const data = chartDataRef.current;
      const step = canvas.width / (data.length - 1 || 1);

      ctx.beginPath();
      ctx.strokeStyle = "#00FF00"; // Зеленый цвет
      ctx.lineWidth = 3;
      ctx.lineJoin = "round"; // Плавные углы линии

      data.forEach((value, index) => {
        const x = index * step;
        const y = canvas.height - value * 10; // Умножаем на 10 для увеличения масштаба
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.shadowColor = "rgba(0, 255, 0, 0.5)"; // Тень для линии
      ctx.shadowBlur = 10; // Размытие тени
      ctx.stroke();
    } else if (chartType === "circle") {
      // Круговая диаграмма
      const data = chartDataRef.current;
      const percentage = (data[data.length - 1] / 10) * 100; // Преобразуем скорость в процент

      ctx.beginPath();
      ctx.arc(150, 75, 60, 0, (Math.PI * 2 * percentage) / 100);
      ctx.lineWidth = 15;
      ctx.strokeStyle = "#0000FF";
      ctx.stroke();
      ctx.shadowColor = "rgba(0, 0, 255, 0.5)"; // Тень для круга
      ctx.shadowBlur = 10; // Размытие тени
    } else if (chartType === "bar") {
      // График со столбцами
      const data = chartDataRef.current;
      const barWidth = canvas.width / data.length;

      data.forEach((value, index) => {
        const x = index * barWidth;
        const height = value * 10; // Высота столбца

        // Градиентный цвет для столбцов
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#00FFFF");
        gradient.addColorStop(1, "#0000FF");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - height, barWidth - 2, height); // Рисуем столбец

        // Тень для столбцов
        ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
        ctx.shadowBlur = 8;
      });
    }
  };

  useEffect(() => {
    setSpeed(Math.random() * 9 + 1);

    const chartInterval = setInterval(() => {
      if (isAnimating) {
        setSpeed(Math.random() * 9 + 1);
      }
    }, Math.random() * 5000 + 3000);

    return () => {
      clearInterval(chartInterval);
    };
  }, [isAnimating]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <canvas ref={canvasRef} className={styles.chartCanvas}></canvas>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={styles.button}
        >
          {isAnimating ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => setChartType("line")}
          className={styles.button}
        >
          Line Graph
        </button>
        <button
          onClick={() => setChartType("circle")}
          className={styles.button}
        >
          Circular Graph
        </button>
        <button
          onClick={() => setChartType("bar")}
          className={styles.button}
        >
          Bar Graph
        </button>
      </div>
      <div className={styles.walletList}>
        {wallets.map((wallet, index) => (
          <div key={index} className={styles.logEntry}>
            <span className={styles.timestamp}>[{wallet.timestamp}]</span>{" "}
            <span className={styles.address}>{wallet.address}</span>{" "}
            {wallet.unlocked ? (
              <span className={styles.unlocked}>
                Unlocked ({wallet.balance.toFixed(8)} BTC)
              </span>
            ) : (
              <span className={styles.locked}>Locked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrixCanvas;
