import { useState } from "react";
import "./AC.css";
import React, { useEffect } from 'react';

interface Props {
  energy: string | null;
  isCharging: boolean;
}

const ACCircle: React.FC<Props> = ({ energy, isCharging }) => {
  const [newenergy, setenergy] = useState(energy);
  const [SelectedSocket, setSelectedSocket] = useState<any>({
    lastMeterValue: {
      kWh: 0,
    },
  });

  useEffect(() => {
    setenergy(energy)

  }, [energy]);

  const GetIdStyle: any = (id: number) => {
    return {
      "--i": `${id}`,
    };
  };

  return (
    <div className="pulse">
      {SelectedSocket?.lastMeterValue ? (
        <>
          <span className={`${isCharging ? 'pulse-active' : ''}`} style={GetIdStyle(0)}></span>
          <span className={`${isCharging ? 'pulse-active' : ''}`} style={GetIdStyle(1)}></span>
          <span className={`${isCharging ? 'pulse-active' : ''}`} style={GetIdStyle(2)}></span>
        </>
      ) : (
        <></>
      )}
      <div className="pulseTextArea" style={{ display: "flex", flexDirection: "column" }}>
        <i className="fa fa-bolt" style={{ fontSize: "3em", paddingTop: "20px", color: "#ec671d" }}/>
        <div style={{marginLeft: "30px",fontWeight: "bold",display: "flex",flexDirection: "row",}}>
          <label className="energy-number" style={{ fontSize: "3em", lineHeight: "70px"}}>{energy}</label>
          <sup className="energy-number" style={{ fontSize: "1em", marginTop: "20px"}}>kWh</sup>
        </div>
      </div>
    </div>
  );
};

export default ACCircle;
