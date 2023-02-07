import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import JobForm from "./JobForm";
import SideBar from "./SideBar";

function PostJob() {
  const [mobileStep, setMobileStep] = useState(true);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "center",
            alignItems: "center",
          }}
          xs={12}
        >
          <Button onClick={() => setMobileStep((p) => !p)}>{mobileStep?"Add new Job":"back"}</Button>
        </Grid>
        <Grid
          sx={{
            display: { xs: mobileStep ? "block" : "none", sm: "block" },
          }}
          item
          xs={12}
          sm={3}
          md={3}
        >
          <SideBar />
        </Grid>
        <Grid
          sx={{
            display: { xs: !mobileStep ? "block" : "none", sm: "block" },
          }}
          item
          xs={12}
          sm={9}
          md={9}
        >
          <JobForm />
        </Grid>
      </Grid>
    </div>
  );
}

export default PostJob;
