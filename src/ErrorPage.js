import React from "react";

const ErrorPage = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
      <h1>Error</h1>
      <p>You are not connected to the Holesky network.</p>
      <p>Please switch to the Holesky network in your Metamask extension.</p>
    </div>
  );
};

export default ErrorPage;
