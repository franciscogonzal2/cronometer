import React, { useState, useRef } from 'react';
import style from './cronometer.module.css';
import { VscDebugStart, VscDebugRestart, VscStopCircle } from "react-icons/vsc";

function Cronometer() {
    const [seg, setSeg] = useState(58);
    const [timer, setTimer] = useState({ ms: 0, s: 0, m: 0, h: 0 });
    const [displayAlert, setDisplayAlert] = useState({ s: 0, m: 0, h: 0 });
    const [alarm, setalarm] = useState(false);
    const [activo, setActivo] = useState(false);
    const [tiempoLimite, setTiempoLimite] = useState(300); // 5 minutos en segundos
    const intervalRef = useRef(null);

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

    const alert = (e, id) => {
        switch(id) {
            case 'minutes':
              return setDisplayAlert(displayAlert.m = e);
              case 'seconds':
              return setDisplayAlert(displayAlert.s = e );
              case 'hours':
              return setDisplayAlert(displayAlert.h = e );
            default:
              return displayAlert;
          }
    }
    const stopTime = () => {
        setActivo(false);
        clearInterval(intervalRef.current);
    };
    const reloadTime = () => {
        setSeg(0);
        stopTime();
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>Cronometer</h1>
            <p>Time:{timer.h}:{timer.m}:{timer.s}:{timer.ms}</p>
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
            <label>
                Limit time to show alert (hour):
                <input
                    type="number"
                    pattern="^-?[0-9]\d*\.?\d*$"
                    value={tiempoLimite}
                    onChange={(e) => alert(e.target.value, 'hours')}
                />
            </label>
            <label>
                Limit time to show alert (minutes):
                <input
                    type="number"
                    id='minutes'
                    pattern="^-?[0-9]\d*\.?\d*$"
                    value={displayAlert.m}
                    onChange={(e) => alert(e.target.value, 'minutes')}
                />
            </label>
            <label>
                Limit time to show alert (seg):
                <input
                    type="tel"
                    pattern="^-?[0-9]\d*\.?\d*$"
                    value={tiempoLimite}
                    onChange={(e) => setTiempoLimite(e.target.value, 'seg')}
                />
            </label>
            {seg >= tiempoLimite && (
                <div className="alerta">¡Tiempo límite alcanzado!</div>
            )}
        </div>
    );
}

export default Cronometer;
