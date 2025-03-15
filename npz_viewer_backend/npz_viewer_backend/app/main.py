from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import os
from dotenv import load_dotenv
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from typing import Dict, List, Optional, Union, Any

app = FastAPI()

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
if '' in ALLOWED_ORIGINS:  # Remove empty strings if any
    ALLOWED_ORIGINS = [origin for origin in ALLOWED_ORIGINS if origin]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_ROWS = 200
MAX_COLS = 200


@app.get("/")
def hello_world():
    return {"message": "Hello, world!"}


@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    all_arrays = {}

    try:
        for file in files:
            temp_file_path = os.path.join(temp_dir, file.filename)

            # Save each file temporarily
            with open(temp_file_path, "wb") as f:
                f.write(await file.read())

            # Check file format and load data
            if file.filename.endswith(".npz"):
                data = np.load(temp_file_path)
                arrays = {
                    key: {
                        "size": data[key].shape,
                        "ndim": data[key].ndim,
                        "data": data[key].tolist(),
                    }
                    for key in data.files
                }
                all_arrays[file.filename] = arrays
            elif file.filename.endswith(".npy"):
                array = np.load(temp_file_path)
                arrays = {
                    "array": {
                        "size": array.shape,
                        "ndim": array.ndim,
                        "data": array.tolist(),
                    }
                }
                all_arrays[file.filename] = arrays
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format for {
                        file.filename}. Please upload .npz or .npy files.",
                )

            # Check the size of each array
            for key, array in arrays.items():
                if len(array["size"]) == 2 and (
                    array["size"][0] > MAX_ROWS or array["size"][1] > MAX_COLS
                ):
                    raise HTTPException(
                        status_code=413,
                        detail=f"Array '{key}' in file '{
                            file.filename}' is too large. "
                        f"Maximum allowed size is {MAX_ROWS}x{MAX_COLS}.",
                    )

        return all_arrays

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error for debugging
        raise HTTPException(
            status_code=500, detail=f"An error occurred: {str(e)}"
        )
    finally:
        # Clean up temp files
        for file in files:
            temp_file_path = os.path.join(temp_dir, file.filename)
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

@app.post("/ml/clustering")
async def apply_clustering(
    data: Dict[str, Any],
):
    """
    Apply clustering algorithms to the provided data

    Parameters:
    - data: Dictionary containing:
        - array: The array data to cluster
        - algorithm: The clustering algorithm to use (kmeans, dbscan)
        - params: Algorithm-specific parameters

    Returns:
    - Dictionary with clustering results
    """
    try:
        array_data = np.array(data["array"])
        algorithm = data["algorithm"]
        params = data.get("params", {})

        # Normalize data if requested
        if data.get("normalize", True):
            scaler = StandardScaler()
            array_data = scaler.fit_transform(array_data)

        # Apply the selected clustering algorithm
        if algorithm == "kmeans":
            n_clusters = params.get("n_clusters", 3)
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            labels = kmeans.fit_predict(array_data).tolist()
            centroids = kmeans.cluster_centers_.tolist()
            inertia = float(kmeans.inertia_)

            return {
                "labels": labels,
                "centroids": centroids,
                "inertia": inertia,
                "n_clusters": n_clusters
            }

        elif algorithm == "dbscan":
            eps = params.get("eps", 0.5)
            min_samples = params.get("min_samples", 5)
            dbscan = DBSCAN(eps=eps, min_samples=min_samples)
            labels = dbscan.fit_predict(array_data).tolist()

            # Count number of clusters (excluding noise points labeled as -1)
            n_clusters = len(set(labels)) - (1 if -1 in labels else 0)

            return {
                "labels": labels,
                "n_clusters": n_clusters,
                "eps": eps,
                "min_samples": min_samples
            }

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported clustering algorithm: {algorithm}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during clustering: {str(e)}"
        )

@app.post("/ml/dimensionality_reduction")
async def apply_dimensionality_reduction(
    data: Dict[str, Any],
):
    """
    Apply dimensionality reduction to the provided data

    Parameters:
    - data: Dictionary containing:
        - array: The array data to reduce
        - algorithm: The reduction algorithm to use (pca)
        - params: Algorithm-specific parameters

    Returns:
    - Dictionary with reduced data
    """
    try:
        array_data = np.array(data["array"])
        algorithm = data["algorithm"]
        params = data.get("params", {})

        # Apply the selected dimensionality reduction algorithm
        if algorithm == "pca":
            n_components = params.get("n_components", 2)
            pca = PCA(n_components=n_components)
            reduced_data = pca.fit_transform(array_data).tolist()
            explained_variance = pca.explained_variance_ratio_.tolist()

            return {
                "reduced_data": reduced_data,
                "explained_variance": explained_variance,
                "n_components": n_components
            }

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported dimensionality reduction algorithm: {algorithm}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during dimensionality reduction: {str(e)}"
        )
