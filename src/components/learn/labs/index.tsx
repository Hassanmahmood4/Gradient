"use client";

import type { ComponentType } from "react";
import type { LabKey } from "@/lib/curriculum";
import { LinearRegressionLab } from "./LinearRegressionLab";
import { GradientDescentLab } from "./GradientDescentLab";
import { LogisticRegressionLab } from "./LogisticRegressionLab";
import { KNNLab } from "./KNNLab";
import { KMeansLab } from "./KMeansLab";
import { DecisionTreeLab } from "./DecisionTreeLab";
import { NeuralNetLab } from "./NeuralNetLab";
import { BiasVarianceLab } from "./BiasVarianceLab";
import { ThresholdLab } from "./ThresholdLab";
import { BroadcastingLab } from "./BroadcastingLab";
import { DataFrameLab } from "./DataFrameLab";
import { AutogradLab } from "./AutogradLab";
import { TFPlaygroundLab } from "./TFPlaygroundLab";
import { HuggingFaceLab } from "./HuggingFaceLab";
import { EmbeddingsLab } from "./EmbeddingsLab";
import { VectorSearchLab } from "./VectorSearchLab";
import { RagLab } from "./RagLab";
import { ChainLab } from "./ChainLab";

export const labs: Record<LabKey, ComponentType> = {
  "linear-regression": LinearRegressionLab,
  "gradient-descent": GradientDescentLab,
  "logistic-regression": LogisticRegressionLab,
  knn: KNNLab,
  kmeans: KMeansLab,
  "decision-tree": () => <DecisionTreeLab defaultTrees={1} />,
  "random-forest": () => <DecisionTreeLab defaultTrees={12} />,
  "neural-net": NeuralNetLab,
  "bias-variance": BiasVarianceLab,
  threshold: ThresholdLab,
  broadcasting: BroadcastingLab,
  dataframe: DataFrameLab,
  autograd: AutogradLab,
  "autograd-tf": TFPlaygroundLab,
  huggingface: HuggingFaceLab,
  embeddings: EmbeddingsLab,
  "vector-search": VectorSearchLab,
  rag: RagLab,
  chain: ChainLab,
};
