import React from 'react';
import { Outlet } from 'react-router-dom';
import { WoolKartProvider } from '../../../context/WoolKartContext';

const WoolKartRoot = () => {
  return (
    <WoolKartProvider>
      <Outlet />
    </WoolKartProvider>
  );
};

export default WoolKartRoot;
