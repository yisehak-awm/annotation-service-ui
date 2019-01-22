import React from "react";
import { Snackbar, SnackbarContent, CircularProgress } from "@material-ui/core";
import styled from "styled-components";

export const SERVER_ADDRESS =
  process.env.REACT_APP_SERVICE_ADDR || "http://localhost:5000";

export const checkDuplicate = (value, array) => {
  return array.includes(value)
    ? {
        error: true,
        helperText: `"${value}" already exists.`
      }
    : null;
};

const ErrorSnackbarContent = styled(SnackbarContent)`
  background: #d13232 !important;
  color: white;
`;

export const showNotification = ({ message, busy }, callBack) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      style={{ margin: "15px" }}
      open
      autoHideDuration={busy ? null : 5}
      onClose={callBack}
    >
      {busy ? (
        <SnackbarContent
          message={
            <span style={{ display: "flex", alignItems: "center" }}>
              <CircularProgress
                size={24}
                color="secondary"
                style={{ marginRight: "15px" }}
              />
              {message}
            </span>
          }
        />
      ) : (
        <ErrorSnackbarContent message={<span>{message}</span>} />
      )}
    </Snackbar>
  );
};
