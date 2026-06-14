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
};
