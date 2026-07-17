from typing import Dict
from uuid import uuid4
import os

import pandas as pd

_DATASETS: Dict[str, pd.DataFrame] = {}


def create_dataset(df: pd.DataFrame) -> str:
    dataset_id = uuid4().hex
    _DATASETS[dataset_id] = df.copy()
    print(
        "[dataset_store] create_dataset",
        {"upload_id": dataset_id, "shape": df.shape, "keys": list(_DATASETS.keys()), "pid": os.getpid()},
    )
    return dataset_id


def get_dataset(dataset_id: str) -> pd.DataFrame:
    print(
        "[dataset_store] get_dataset",
        {"upload_id": dataset_id, "keys": list(_DATASETS.keys()), "pid": os.getpid()},
    )
    dataset = _DATASETS.get(dataset_id)
    if dataset is None:
        raise KeyError(f"Dataset {dataset_id} not found")
    return dataset.copy()


def update_dataset(dataset_id: str, df: pd.DataFrame) -> None:
    if dataset_id not in _DATASETS:
        raise KeyError(f"Dataset {dataset_id} not found")
    _DATASETS[dataset_id] = df.copy()
    print(
        "[dataset_store] update_dataset",
        {"upload_id": dataset_id, "shape": df.shape, "keys": list(_DATASETS.keys()), "pid": os.getpid()},
    )
