"use client";

import { updateServerState } from "@/server/Server";
import { useServerState } from "@/server/ClientUtility";
import React from "react";
import { useDropzone } from "react-dropzone";

export const PreviewImageOption = (props: {}) => {
  const { serverState, isLoading } = useServerState();

  const [image, setImage] = React.useState<string>("");
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length == 1) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        if (typeof dataURL === "string") {
          setImage(dataURL);
          serverState!.previewImage = dataURL;
          updateServerState(serverState!);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  React.useEffect(() => {
    if (serverState) {
      setImage(serverState.previewImage);
    }
  }, [serverState]);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-xl">
      <div className="flex h-full w-full flex-col gap-2 rounded-xl p-2">
        <div
          {...getRootProps()}
          className="transition-height flex w-full grow items-center justify-center rounded-xl bg-french-600 p-4 duration-200 ease-in-out"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <input {...getInputProps()} />
          {image == "" ? (
            isDragActive ? (
              <p>
                <i className="bi bi-image-fill text-6xl text-french-200"></i>
              </p>
            ) : (
              <p>
                <i className="bi bi-image text-6xl text-french-200"></i>
              </p>
            )
          ) : null}
        </div>
        {image ? (
          <button
            className="flex w-full items-center justify-center rounded-full bg-french-100 p-2"
            onClick={() => {
              setImage("");
              serverState!.previewImage = "";
              updateServerState(serverState!);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
};
