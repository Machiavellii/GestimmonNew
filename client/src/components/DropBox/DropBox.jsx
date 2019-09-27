import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import FileDrop from "react-file-drop";
import { PhotoCamera } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const styles = theme => ({
  dropContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid black",
    borderStyle: "dashed",
    width: 200,
    height: 200,
    color: "black",
    padding: 10
  }
});

function DropBox({ ...props }) {
  const {
    title,
    instruction,
    or,
    buttonName,
    accept,
    onDrop,
    onChange,
    classes,
    ...rest
  } = props;
  return (
    <div className={classes.dropContainer}>
      <FileDrop onDrop={onDrop}>
        {title && <strong>{title}</strong>}
        <PhotoCamera />
        {instruction}
        <br />
        {or}
        <Button
          variant="contained"
          color="primary"
          component="label"
          className={classes.button}
          style={{ marginTop: 4 }}
        >
          <input
            accept={accept}
            style={{ display: "none" }}
            type="file"
            onChange={onChange}
            {...rest}
          />
          {buttonName}
        </Button>
      </FileDrop>
    </div>
  );
}

export default withStyles(styles)(DropBox);
