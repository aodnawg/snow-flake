import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import run from "./run";
import fs from "./fs";

const num = 9;

const useSnowFlake = () => {
  const [url, setUrl] = useState<string[] | null>(null);
  const containers = [...Array(num)].map((_) => document.createElement("div"));
  useEffect(() => {
    const dataUrlList = containers.map((container) => {
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      run(container, renderer, fs);

      const canvasEl = container.querySelector("canvas");
      if (canvasEl === null) {
        throw new Error();
      }
      const dataUrl = canvasEl.toDataURL("image/png");
      return dataUrl;
    });
    setUrl(dataUrlList);
  }, []);
  return url;
};

const SnowRow: React.FC<{ urlList: string[] }> = ({ urlList: urlList_ }) => {
  const urlList = urlList_.slice(
    0,
    Math.floor(Math.random() * (urlList_.length - 3) + 3)
  );
  return (
    <div className="snow-flake-row">
      {urlList.map((url, i) => {
        return (
          <div>
            <img
              src={url}
              className={`snow-flake-row__img spin-anim${
                Math.floor(Math.random() * 3) + 1
              }`}
              key={i}
              style={{ animationDelay: `${Math.random() * 10000}ms` }}
            />
          </div>
        );
      })}
    </div>
  );
};

const SnowCanvas = () => {
  const urlList = useSnowFlake();

  if (urlList === null) {
    return <div>loading ...</div>;
  }

  return (
    <div>
      <div className="snow-grid">
        {urlList.map((url, i) => {
          return (
            <div className="snow-glid__item">
              <img src={url} alt="" key={i} />
            </div>
          );
        })}
      </div>
      <div className="snow-flake-container">
        <SnowRow urlList={urlList} />
        <SnowRow urlList={urlList} />
        <SnowRow urlList={urlList} />
        <SnowRow urlList={urlList} />
      </div>
    </div>
  );
};

export default SnowCanvas;
