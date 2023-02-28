import React, { useState, useRef, useEffect } from 'react';
import style from './cronometer.module.css';
import { VscDebugStart, VscDebugRestart, VscStopCircle } from "react-icons/vsc";

function Cronometer() {
    const [timer, setTimer] = useState({ ms: 0, s: 0, m: 0, h: 0 });
    const [displayAlert, setDisplayAlert] = useState({ s: 0, m: 0, h: 0 });
    const [alarm, setalarm] = useState(false);
    const [activo, setActivo] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const minutestoInt = parseFloat(displayAlert.m);
        const secondosInt = parseFloat(displayAlert.s);
        const hoursInt = parseFloat(displayAlert.h);
        if (displayAlert.h !== 0 || displayAlert.m !== 0 || displayAlert.s !== 0) {
            if (timer.m === minutestoInt && timer.s === secondosInt && timer.h === hoursInt) {
                setalarm(true)
            }
        }
    }, [timer, displayAlert]);

    const initialTime = () => {
        setActivo(true);
        intervalRef.current = setInterval(() => {
            setTimer((prevValue) => {
                let ms = prevValue.ms + 1;
                let s = prevValue.s;
                let m = prevValue.m;
                let h = prevValue.h

                if (ms === 100) {
                    ms = 0;
                    s = prevValue.s + 1;
                }
                if (s === 60) {
                    s = 0;
                    m = prevValue.m + 1;
                }
                if (m === 60) {
                    m = 0;
                    h = prevValue.h + 1;
                }
                return { ms, s, m, h };
            });
        }, 10);
    }
    const stopTime = () => {
        setActivo(false);
        clearInterval(intervalRef.current);
    };
    const reloadTime = () => {
        setTimer({ ms: 0, s: 0, m: 0, h: 0 })
        stopTime();
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>Cronometer</h1>
            <p className={style.timernumber}>{timer.h}:{timer.m}:{timer.s}:{timer.ms}</p>
            <div className={style.controler}>
                <div className={style.initstop}>
                    {activo ? (
                        <VscStopCircle className={style.buttons} onClick={stopTime} />
                    ) : (
                        <VscDebugStart className={style.buttons} onClick={initialTime} />
                    )}
                </div>
                <div className={style.reload}>
                    <VscDebugRestart className={style.buttons} onClick={reloadTime} />
                </div>
            </div>
            <br />
            <div className={style.form}>
                <div className={style.text}>
                    <span className={style.titleTime}>Limit time to show alert (hour):</span>
                    <span className={style.titleTime}>Limit time to show alert (minutes):</span>
                    <span className={style.titleTime}>Limit time to show alert (seg):</span>
                </div>
                <div className={style.label}>
                    <input
                        className={style.input}
                        type="text"
                        pattern="^-?[0-9]\d*\.?\d*$"
                        value={displayAlert.h === 0 ? '' : displayAlert.h}
                        onChange={(e) => setDisplayAlert((prev) => ({ ...prev, h: e.target.value }))}
                    />
                    <input
                        className={style.input}
                        type="text"
                        id='minutes'
                        pattern="^-?[0-9]\d*\.?\d*$"
                        value={displayAlert.m === 0 ? '' : displayAlert.m}
                        onChange={(e) => setDisplayAlert((prev) => ({ ...prev, m: e.target.value }))}
                    />
                    <input
                        className={style.input}
                        type="text"
                        pattern="^-?[0-9]\d*\.?\d*$"
                        value= {displayAlert.s === 0 ? '' : displayAlert.s}
                        onChange={(e) => setDisplayAlert((prev) => ({ ...prev, s: e.target.value }))}
                    />
                </div>
            </div>
            {alarm && (
                <div className="alerta">¡Tiempo límite alcanzado!</div>
            )}
        </div>
    );
}

export default Cronometer;
