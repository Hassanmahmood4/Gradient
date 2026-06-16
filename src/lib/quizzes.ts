import "server-only";
import type { ClientQuestion, Question } from "./quiz-types";

/* ----------------------------------------------------------------------------
   Multiple-choice questions per module (plus a 15-question final exam). Keyed
   by topic slug. This file is `server-only`: the `answer` keys must never reach
   the browser. The client receives sanitized `ClientQuestion`s and grading is
   done by the `gradeQuiz` Server Action.
---------------------------------------------------------------------------- */

export type { Question } from "./quiz-types";

export const POINTS_PER_CORRECT = 10;
export const FINAL_EXAM_SLUG = "final-exam";

export const quizzes: Record<string, Question[]> = {
  "what-is-machine-learning": [
    {
      q: "What best describes machine learning?",
      options: [
        "Writing explicit if/else rules for every case",
        "Learning patterns from data instead of hand-written rules",
        "Storing data in a database for fast lookup",
        "Manually labelling every prediction",
      ],
      answer: 1,
    },
    {
      q: "A model is best thought of as…",
      options: [
        "A fixed lookup table",
        "A function with adjustable parameters tuned to fit data",
        "A random number generator",
        "A spreadsheet of results",
      ],
      answer: 1,
    },
    {
      q: "When is ML the wrong tool?",
      options: [
        "When the rules are easy to write by hand",
        "When the pattern is hidden in lots of data",
        "When the pattern changes over time",
        "When the rules are too fuzzy to specify",
      ],
      answer: 0,
    },
  ],
  "types-of-machine-learning": [
    {
      q: "Supervised learning requires…",
      options: ["No data at all", "Labelled examples", "Only rewards", "Unlabelled data only"],
      answer: 1,
    },
    {
      q: "Clustering is an example of…",
      options: ["Supervised learning", "Reinforcement learning", "Unsupervised learning", "Regression"],
      answer: 2,
    },
    {
      q: "An agent learning from rewards and penalties is doing…",
      options: ["Classification", "Reinforcement learning", "Dimensionality reduction", "Supervised learning"],
      answer: 1,
    },
  ],
  "the-ml-workflow": [
    {
      q: "Which step usually delivers the biggest real-world accuracy gains?",
      options: ["A fancier model", "Better data and features", "More GPUs", "A bigger learning rate"],
      answer: 1,
    },
    {
      q: "Why hold out a test set?",
      options: [
        "To train faster",
        "To measure performance honestly on unseen data",
        "To increase the dataset size",
        "To tune the learning rate",
      ],
      answer: 1,
    },
    {
      q: "After deployment you should…",
      options: [
        "Never touch the model again",
        "Monitor for drift and retrain as needed",
        "Delete the training data",
        "Stop measuring metrics",
      ],
      answer: 1,
    },
  ],
  "bias-variance-tradeoff": [
    {
      q: "High bias typically means the model is…",
      options: ["Too complex", "Too simple (underfitting)", "Perfectly fit", "Overfit"],
      answer: 1,
    },
    {
      q: "High variance shows up as…",
      options: [
        "Poor training and poor test scores",
        "Great training but poor test scores",
        "Equal train and test error",
        "No error at all",
      ],
      answer: 1,
    },
    {
      q: "Increasing model complexity generally…",
      options: [
        "Raises bias, lowers variance",
        "Lowers bias, raises variance",
        "Lowers both",
        "Changes nothing",
      ],
      answer: 1,
    },
    {
      q: "As `degree` climbs in this loop, what typically happens to test_err?",
      code: `train_err = mse(model.predict(X_train), y_train)
test_err  = mse(model.predict(X_test),  y_test)`,
      options: [
        "It keeps falling forever, just like train_err",
        "It falls, then climbs again as the model overfits",
        "It stays perfectly constant",
        "It is always equal to train_err",
      ],
      answer: 1,
    },
  ],
  "overfitting-and-regularization": [
    {
      q: "Overfitting is best described as…",
      options: [
        "Fitting the noise instead of the signal",
        "Being too simple to learn",
        "Training too slowly",
        "Using too little data per batch",
      ],
      answer: 0,
    },
    {
      q: "Regularization works by…",
      options: [
        "Adding more layers",
        "Penalising large weights to keep the model simple",
        "Removing the test set",
        "Increasing the learning rate",
      ],
      answer: 1,
    },
    {
      q: "If λ (the regularization strength) is far too large, the model will…",
      options: ["Overfit", "Underfit", "Train faster with no downside", "Memorise the data"],
      answer: 1,
    },
    {
      q: "In this loss, what does increasing `lam` do?",
      code: `data_loss = mse(predict(w, X), y)
penalty   = lam * sum(wj ** 2 for wj in w)
return data_loss + penalty`,
      options: [
        "Pushes the weights to grow larger",
        "Penalises large weights more, simplifying the model",
        "Removes the data-fitting term entirely",
        "Speeds up training with no downside",
      ],
      answer: 1,
    },
  ],
  "data-preprocessing": [
    {
      q: "Why do distance- and gradient-based models need feature scaling?",
      options: [
        "It makes the data smaller on disk",
        "Otherwise features with larger ranges dominate the calculation",
        "It removes the need for labels",
        "It guarantees a global minimum",
      ],
      answer: 1,
    },
    {
      q: "Standardisation (z-score) transforms a feature to have…",
      options: [
        "Values strictly between 0 and 1",
        "Mean 0 and unit variance",
        "Only integer values",
        "No missing values",
      ],
      answer: 1,
    },
    {
      q: "To avoid data leakage, a scaler or imputer should be fit on…",
      options: [
        "The whole dataset including the test set",
        "The training set only, then applied to the rest",
        "The test set only",
        "Each row independently",
      ],
      answer: 1,
    },
  ],
  "linear-regression": [
    {
      q: "Linear regression with one feature predicts…",
      options: ["ŷ = w·x + b", "ŷ = σ(w·x)", "a class label", "a cluster id"],
      answer: 0,
    },
    {
      q: "What does mean squared error measure?",
      options: [
        "The number of misclassifications",
        "The average squared residual between predictions and targets",
        "The slope of the line",
        "The variance of x",
      ],
      answer: 1,
    },
    {
      q: "The least-squares slope equals…",
      options: [
        "mean(y) − mean(x)",
        "covariance(x, y) ÷ variance(x)",
        "variance(x) ÷ variance(y)",
        "the largest data point",
      ],
      answer: 1,
    },
    {
      q: "What does this line compute?",
      code: `w = covariance(x, y) / variance(x)`,
      options: [
        "The intercept of the line",
        "The least-squares slope",
        "The mean squared error",
        "The variance of the residuals",
      ],
      answer: 1,
    },
  ],
  "gradient-descent": [
    {
      q: "Gradient descent updates parameters using…",
      options: ["θ ← θ + η·∇L", "θ ← θ − η·∇L", "θ ← θ × η", "θ ← ∇L only"],
      answer: 1,
    },
    {
      q: "If the learning rate is far too large, the optimiser will…",
      options: ["Converge instantly", "Overshoot and diverge", "Stop moving", "Always find the global minimum"],
      answer: 1,
    },
    {
      q: "Mini-batch gradient descent uses…",
      options: [
        "The entire dataset every step",
        "A single example every step",
        "A small group of examples every step",
        "No data",
      ],
      answer: 2,
    },
    {
      q: "What happens to this update when `lr` is very large?",
      code: `theta -= lr * grad(theta)`,
      options: [
        "θ converges instantly",
        "Each step overshoots, so θ oscillates and can diverge",
        "θ stops changing",
        "The gradient becomes zero",
      ],
      answer: 1,
    },
  ],
  "polynomial-regression": [
    {
      q: "Polynomial regression fits curves by…",
      options: [
        "Adding powers of x as extra features",
        "Using a different optimiser",
        "Removing the bias term",
        "Switching to classification",
      ],
      answer: 0,
    },
    {
      q: "Polynomial regression is still 'linear' because it is…",
      options: ["Linear in x", "Linear in the weights", "A straight line", "Non-parametric"],
      answer: 1,
    },
    {
      q: "A very high polynomial degree tends to…",
      options: ["Underfit", "Overfit and wiggle between points", "Reduce variance", "Ignore the data"],
      answer: 1,
    },
  ],
  "regularized-regression": [
    {
      q: "Ridge regression adds a penalty proportional to…",
      options: ["Σ|wⱼ|", "Σwⱼ²", "the number of features", "the learning rate"],
      answer: 1,
    },
    {
      q: "Which method can drive some weights exactly to zero?",
      options: ["Ridge (L2)", "Lasso (L1)", "Neither", "Both equally"],
      answer: 1,
    },
    {
      q: "Lasso is therefore useful for…",
      options: ["Automatic feature selection", "Speeding up GPUs", "Increasing variance", "Removing the bias"],
      answer: 0,
    },
  ],
  "logistic-regression": [
    {
      q: "Logistic regression is used for…",
      options: ["Regression of real numbers", "Classification", "Clustering", "Dimensionality reduction"],
      answer: 1,
    },
    {
      q: "The sigmoid function maps a score to…",
      options: ["Any real number", "A value between 0 and 1", "An integer class id", "A negative number"],
      answer: 1,
    },
    {
      q: "Logistic regression is trained by minimising…",
      options: ["Mean squared error", "Log loss (cross-entropy)", "Gini impurity", "Inertia"],
      answer: 1,
    },
    {
      q: "What does `predict_proba` return here?",
      code: `def predict_proba(x, w, b):
    return sigmoid(w @ x + b)`,
      options: [
        "A class label (0 or 1)",
        "A probability between 0 and 1",
        "The raw linear score, unbounded",
        "The log loss",
      ],
      answer: 1,
    },
  ],
  "k-nearest-neighbors": [
    {
      q: "KNN classifies a new point by…",
      options: [
        "Fitting a line",
        "A majority vote of its k closest training points",
        "Building a tree",
        "Computing a sigmoid",
      ],
      answer: 1,
    },
    {
      q: "A very small k tends to make predictions…",
      options: ["Smoother", "Noisier and more sensitive", "Constant", "Independent of the data"],
      answer: 1,
    },
    {
      q: "Before using KNN you should usually…",
      options: ["Normalise the features", "Remove all labels", "Increase the learning rate", "Add polynomial terms"],
      answer: 0,
    },
    {
      q: "What is `k` controlling in this function?",
      code: `nearest = sorted(dists)[:k]
votes = [yi for _, yi in nearest]
return majority(votes)`,
      options: [
        "The learning rate",
        "How many nearest neighbours get to vote",
        "The number of features",
        "The distance metric used",
      ],
      answer: 1,
    },
  ],
  "decision-trees": [
    {
      q: "A decision tree splits the data using…",
      options: ["Random lines", "Threshold questions on features", "A sigmoid", "Distance to neighbours"],
      answer: 1,
    },
    {
      q: "Gini impurity measures…",
      options: ["How mixed the classes are at a node", "The tree depth", "The learning rate", "The number of features"],
      answer: 0,
    },
    {
      q: "Increasing max depth tends to…",
      options: ["Reduce overfitting", "Increase overfitting", "Have no effect", "Make the tree linear"],
      answer: 1,
    },
    {
      q: "What does `best_split` select at each node?",
      code: `return min(all_splits(X), key=lambda s: weighted_gini(s, y))`,
      options: [
        "A random feature and threshold",
        "The split with the lowest resulting impurity",
        "The split that creates the deepest branch",
        "The split with the most points on one side",
      ],
      answer: 1,
    },
  ],
  "random-forest": [
    {
      q: "A random forest improves on a single tree mainly by…",
      options: [
        "Averaging many decorrelated trees to reduce variance",
        "Making one very deep tree",
        "Removing all randomness",
        "Using a sigmoid output",
      ],
      answer: 0,
    },
    {
      q: "Bagging means each tree is trained on…",
      options: [
        "The full dataset",
        "A bootstrap sample (random draw with replacement)",
        "Only the test set",
        "A single point",
      ],
      answer: 1,
    },
    {
      q: "Feature randomness at each split helps by…",
      options: ["Making trees identical", "Decorrelating the trees", "Speeding up inference only", "Removing bias entirely"],
      answer: 1,
    },
    {
      q: "What does `bootstrap_sample` give each tree?",
      code: `Xs, ys = bootstrap_sample(X, y)
trees.append(DecisionTree(max_features="sqrt").fit(Xs, ys))`,
      options: [
        "The full dataset, unchanged",
        "A random sample drawn with replacement",
        "Only the test set",
        "A single data point",
      ],
      answer: 1,
    },
  ],
  "naive-bayes": [
    {
      q: "Naive Bayes is based on…",
      options: ["Gradient descent", "Bayes’ theorem", "Distance voting", "Margin maximisation"],
      answer: 1,
    },
    {
      q: "Its 'naive' assumption is that features are…",
      options: [
        "Perfectly correlated",
        "Independent given the class",
        "All numeric",
        "Normally distributed",
      ],
      answer: 1,
    },
    {
      q: "A classic strong use case for Naive Bayes is…",
      options: ["Image segmentation", "Text/spam classification", "Clustering", "Reinforcement learning"],
      answer: 1,
    },
  ],
  "support-vector-machines": [
    {
      q: "An SVM looks for the boundary with the…",
      options: ["Smallest margin", "Largest margin between classes", "Most support vectors", "Lowest depth"],
      answer: 1,
    },
    {
      q: "The kernel trick lets an SVM…",
      options: [
        "Train without data",
        "Separate non-linear data via an implicit higher-dimensional space",
        "Avoid choosing C",
        "Skip optimisation",
      ],
      answer: 1,
    },
    {
      q: "Support vectors are…",
      options: [
        "All the training points",
        "The points closest to the boundary that define it",
        "The misclassified points only",
        "The cluster centroids",
      ],
      answer: 1,
    },
  ],
  "gradient-boosting": [
    {
      q: "Gradient boosting builds its trees…",
      options: [
        "In parallel, then averages them",
        "Sequentially, each correcting the previous errors",
        "All at once from one bootstrap sample",
        "Without any trees at all",
      ],
      answer: 1,
    },
    {
      q: "Each new tree in boosting is trained to predict the…",
      options: [
        "Raw labels from scratch",
        "Residual errors of the current ensemble",
        "Cluster assignments",
        "Feature importances",
      ],
      answer: 1,
    },
    {
      q: "Compared with a random forest, boosting mainly reduces…",
      options: [
        "Variance by averaging independent trees",
        "Bias by stacking dependent trees",
        "The need for any data",
        "Training time to zero",
      ],
      answer: 1,
    },
  ],
  "k-means-clustering": [
    {
      q: "K-means alternates which two steps?",
      options: [
        "Split and prune",
        "Assign points to nearest centroid, then move centroids to the mean",
        "Forward and backward pass",
        "Bootstrap and vote",
      ],
      answer: 1,
    },
    {
      q: "K-means minimises…",
      options: ["Log loss", "Gini impurity", "Inertia (within-cluster squared distance)", "Margin width"],
      answer: 2,
    },
    {
      q: "The elbow method helps you choose…",
      options: ["The learning rate", "The number of clusters k", "The tree depth", "The kernel"],
      answer: 1,
    },
    {
      q: "Which two steps does this loop alternate?",
      code: `labels = [nearest_centroid(x, centroids) for x in X]
new = [mean(points_in(c, X, labels)) for c in range(k)]`,
      options: [
        "Forward pass and backward pass",
        "Assign points to nearest centroid, then move centroids to the mean",
        "Split and prune",
        "Bootstrap and vote",
      ],
      answer: 1,
    },
  ],
  "hierarchical-clustering": [
    {
      q: "Agglomerative clustering starts with…",
      options: [
        "One big cluster",
        "Every point as its own cluster",
        "k random centroids",
        "A labelled dataset",
      ],
      answer: 1,
    },
    {
      q: "Its output is visualised as a…",
      options: ["Confusion matrix", "Dendrogram", "ROC curve", "Scatter line"],
      answer: 1,
    },
    {
      q: "An advantage over k-means is that you…",
      options: [
        "Must choose k in advance",
        "Don’t need to choose k in advance",
        "Always run faster",
        "Need labels",
      ],
      answer: 1,
    },
  ],
  pca: [
    {
      q: "PCA finds new axes ordered by…",
      options: ["Alphabetical order", "How much variance they capture", "Class label", "Distance to origin"],
      answer: 1,
    },
    {
      q: "PCA is mainly used for…",
      options: ["Classification", "Dimensionality reduction", "Reinforcement learning", "Labelling data"],
      answer: 1,
    },
    {
      q: "Before computing components, PCA first…",
      options: ["Centres the data", "Shuffles the labels", "Adds polynomial terms", "Trains a tree"],
      answer: 0,
    },
  ],
  dbscan: [
    {
      q: "Unlike k-means, DBSCAN…",
      options: [
        "Requires you to choose k in advance",
        "Finds arbitrarily shaped clusters and labels outliers as noise",
        "Always produces round clusters",
        "Needs labelled data",
      ],
      answer: 1,
    },
    {
      q: "A core point is one that…",
      options: [
        "Has at least minPts neighbours within radius ε",
        "Sits exactly at a cluster’s centre",
        "Has no neighbours at all",
        "Is the first point processed",
      ],
      answer: 0,
    },
    {
      q: "DBSCAN struggles most when clusters…",
      options: [
        "Are all the same size",
        "Have very different densities",
        "Are perfectly round",
        "Contain no noise",
      ],
      answer: 1,
    },
  ],
  "the-perceptron": [
    {
      q: "A perceptron computes…",
      options: [
        "A weighted sum plus bias, through an activation",
        "A distance vote",
        "A Gini split",
        "A covariance",
      ],
      answer: 0,
    },
    {
      q: "A single perceptron can only learn boundaries that are…",
      options: ["Circular", "Linear (straight)", "Arbitrary curves", "Tree-shaped"],
      answer: 1,
    },
    {
      q: "Which problem can a single perceptron NOT solve?",
      options: ["AND", "OR", "XOR", "NOT"],
      answer: 2,
    },
  ],
  "neural-networks": [
    {
      q: "Stacking layers with non-linear activations lets a network…",
      options: [
        "Only draw straight lines",
        "Represent curved, complex boundaries",
        "Avoid training",
        "Skip the loss function",
      ],
      answer: 1,
    },
    {
      q: "In the forward pass, data flows…",
      options: ["Output → input", "Input → hidden layers → output", "In a circle", "Randomly"],
      answer: 1,
    },
    {
      q: "With too few hidden units, the network will…",
      options: [
        "Always overfit",
        "Fail to separate complex classes",
        "Train instantly to 100%",
        "Become linear regression",
      ],
      answer: 1,
    },
    {
      q: "Why is `relu` applied inside this loop?",
      code: `for W, b in layers:
    a = relu(W @ a + b)`,
      options: [
        "To speed up the matrix multiplication",
        "To add non-linearity so stacked layers don’t collapse into one",
        "To normalise the inputs to each layer",
        "To compute the loss",
      ],
      answer: 1,
    },
  ],
  backpropagation: [
    {
      q: "Backpropagation computes gradients using…",
      options: ["The chain rule, working backward", "Random search", "A distance vote", "Bootstrap sampling"],
      answer: 0,
    },
    {
      q: "The correct order of one training step is…",
      options: [
        "Update → forward → backward",
        "Forward pass → backward pass → weight update",
        "Backward → forward → update",
        "Forward → update → backward",
      ],
      answer: 1,
    },
    {
      q: "Backprop is efficient because it…",
      options: [
        "Skips the forward pass",
        "Reuses intermediate results via the chain rule",
        "Only updates one weight",
        "Needs no derivatives",
      ],
      answer: 1,
    },
  ],
  "activation-functions": [
    {
      q: "Without a non-linear activation, stacked layers collapse into…",
      options: ["A single linear function", "A decision tree", "A clustering", "A sigmoid"],
      answer: 0,
    },
    {
      q: "Which activation is the common default for hidden layers?",
      options: ["Sigmoid", "ReLU", "Softmax", "Linear"],
      answer: 1,
    },
    {
      q: "Softmax is typically used to…",
      options: [
        "Output a multi-class probability distribution",
        "Speed up training",
        "Replace the loss function",
        "Cluster the data",
      ],
      answer: 0,
    },
  ],
  "train-test-split-and-cross-validation": [
    {
      q: "Why not evaluate a model on its training data?",
      options: [
        "It’s too slow",
        "It has already seen the answers, so the score is optimistic",
        "It uses too much memory",
        "It’s against the rules of math",
      ],
      answer: 1,
    },
    {
      q: "The validation set is used to…",
      options: [
        "Fit the model parameters",
        "Tune hyperparameters and choose models",
        "Give the final performance number",
        "Store the labels",
      ],
      answer: 1,
    },
    {
      q: "k-fold cross-validation is most useful when…",
      options: ["You have unlimited data", "Data is scarce", "You have no labels", "You only need speed"],
      answer: 1,
    },
  ],
  "confusion-matrix": [
    {
      q: "A false positive is when the model predicts…",
      options: [
        "Positive but it’s actually negative",
        "Negative but it’s actually positive",
        "Positive and it’s correct",
        "Negative and it’s correct",
      ],
      answer: 0,
    },
    {
      q: "On heavily imbalanced data, accuracy can be misleading because…",
      options: [
        "It’s impossible to compute",
        "Always predicting the majority class can still score high",
        "It requires probabilities",
        "It ignores true negatives",
      ],
      answer: 1,
    },
    {
      q: "Accuracy equals…",
      options: ["TP / (TP+FP)", "(TP+TN) / total", "TP / (TP+FN)", "TN / total"],
      answer: 1,
    },
    {
      q: "Which count does this line compute?",
      code: `FP = sum(t == 0 and p == 1 for t, p in zip(y_true, y_pred))`,
      options: [
        "True positives",
        "False positives (false alarms)",
        "False negatives (misses)",
        "True negatives",
      ],
      answer: 1,
    },
  ],
  "precision-recall-f1": [
    {
      q: "Precision answers…",
      options: [
        "Of all real positives, how many did we catch?",
        "Of everything flagged positive, how much really is?",
        "How fast is the model?",
        "How deep is the tree?",
      ],
      answer: 1,
    },
    {
      q: "Recall is defined as…",
      options: ["TP / (TP+FP)", "TP / (TP+FN)", "TN / (TN+FP)", "(TP+TN)/total"],
      answer: 1,
    },
    {
      q: "The F1 score is the…",
      options: [
        "Sum of precision and recall",
        "Harmonic mean of precision and recall",
        "Larger of the two",
        "Difference between them",
      ],
      answer: 1,
    },
    {
      q: "What is this line measuring?",
      code: `recall = TP / (TP + FN)`,
      options: [
        "Precision",
        "Recall — of all real positives, how many we caught",
        "Overall accuracy",
        "The F1 score",
      ],
      answer: 1,
    },
  ],
  "roc-and-auc": [
    {
      q: "The ROC curve is traced by varying the…",
      options: ["Learning rate", "Decision threshold", "Number of features", "Tree depth"],
      answer: 1,
    },
    {
      q: "An AUC of 0.5 means the model…",
      options: ["Is perfect", "Is no better than random", "Always overfits", "Has zero recall"],
      answer: 1,
    },
    {
      q: "A key advantage of AUC is that it is…",
      options: ["Threshold-independent", "Only valid for regression", "Faster to train", "Dependent on class balance only"],
      answer: 0,
    },
    {
      q: "What is this loop sweeping to trace the ROC curve?",
      code: `for thr in sorted(set(scores), reverse=True):
    pred = [s >= thr for s in scores]`,
      options: [
        "The learning rate",
        "The decision threshold",
        "The number of features",
        "The tree depth",
      ],
      answer: 1,
    },
  ],
  numpy: [
    {
      q: "What is NumPy’s core data structure?",
      options: [
        "The DataFrame",
        "The ndarray — a typed, n-dimensional array",
        "A linked list",
        "A SQL table",
      ],
      answer: 1,
    },
    {
      q: "Why is vectorised NumPy code faster than a Python loop?",
      options: [
        "It uses far more memory",
        "A single optimised C loop runs over the whole array",
        "It skips the computation entirely",
        "It always runs on the GPU",
      ],
      answer: 1,
    },
    {
      q: "Broadcasting lets you…",
      options: [
        "Send arrays over a network",
        "Combine arrays of different shapes without manual copying",
        "Convert arrays into text",
        "Sort an array in place",
      ],
      answer: 1,
    },
  ],
  pandas: [
    {
      q: "A pandas DataFrame is…",
      options: [
        "A 1-D array",
        "A 2-D table with labeled rows and columns",
        "A neural network layer",
        "A plotting library",
      ],
      answer: 1,
    },
    {
      q: "Which selects rows by their label?",
      options: [".iloc", ".loc", "@", "reshape"],
      answer: 1,
    },
    {
      q: "Before passing data to scikit-learn you usually…",
      options: [
        "Print the whole table",
        "Convert to NumPy with to_numpy()",
        "Delete the index",
        "Shuffle the columns",
      ],
      answer: 1,
    },
  ],
  "scikit-learn": [
    {
      q: "Which call trains a scikit-learn estimator?",
      options: [".transform(X)", ".fit(X, y)", ".plot()", ".compile()"],
      answer: 1,
    },
    {
      q: "What does a Pipeline help prevent?",
      options: [
        "GPU usage",
        "Data leakage — the same steps run on train and test",
        "Overfitting entirely",
        "Importing NumPy",
      ],
      answer: 1,
    },
    {
      q: "scikit-learn is best suited to…",
      options: [
        "Training giant language models",
        "Classical ML on mostly tabular data",
        "Rendering 3-D graphics",
        "Managing databases",
      ],
      answer: 1,
    },
  ],
  pytorch: [
    {
      q: "What two superpowers does PyTorch add over NumPy?",
      options: [
        "Plotting and CSV loading",
        "GPU tensors and automatic differentiation",
        "Web serving and authentication",
        "Spreadsheets and SQL",
      ],
      answer: 1,
    },
    {
      q: "What does loss.backward() do?",
      options: [
        "Prints the loss",
        "Computes gradients and fills .grad",
        "Updates the weights directly",
        "Loads the training data",
      ],
      answer: 1,
    },
    {
      q: "Why wrap the weight update in torch.no_grad()?",
      options: [
        "To speed up printing",
        "To stop autograd from tracking those operations",
        "To enable the GPU",
        "To shuffle the data",
      ],
      answer: 1,
    },
  ],
  tensorflow: [
    {
      q: "Most people use TensorFlow through…",
      options: ["Keras, its high-level API", "Assembly", "pandas", "the terminal only"],
      answer: 0,
    },
    {
      q: "tf.GradientTape is used to…",
      options: [
        "Save files to disk",
        "Record the forward pass for custom training",
        "Draw charts",
        "Split the dataset",
      ],
      answer: 1,
    },
    {
      q: "What runs a trained TensorFlow model on a phone?",
      options: ["TF Lite", "NumPy", "Chroma", "LangChain"],
      answer: 0,
    },
  ],
  "hugging-face": [
    {
      q: "The main benefit of Hugging Face is…",
      options: [
        "Writing every model from scratch",
        "Downloading pretrained models instead of training from zero",
        "Faster Python loops",
        "A new database engine",
      ],
      answer: 1,
    },
    {
      q: "pipeline() is…",
      options: [
        "A plumbing tool",
        "The quickest way to load and run a model for a task",
        "A vector database",
        "A loss function",
      ],
      answer: 1,
    },
    {
      q: "Before shipping a model from the Hub you should check its…",
      options: ["File size only", "Licence and intended use", "Number of stars", "Colour"],
      answer: 1,
    },
  ],
  embeddings: [
    {
      q: "An embedding turns data into…",
      options: [
        "A SQL row",
        "A vector where similar items sit near each other",
        "A compressed zip file",
        "A single class label",
      ],
      answer: 1,
    },
    {
      q: "Cosine similarity measures…",
      options: [
        "File size",
        "The angle between two vectors",
        "Training time",
        "The learning rate",
      ],
      answer: 1,
    },
    {
      q: "Embeddings power all of these EXCEPT…",
      options: ["Semantic search", "Clustering", "RAG retrieval", "Formatting a CSV"],
      answer: 3,
    },
  ],
  "vector-databases": [
    {
      q: "A vector database is optimised for…",
      options: [
        "Exact SQL joins",
        "Approximate nearest-neighbor search over embeddings",
        "Editing images",
        "Sending email",
      ],
      answer: 1,
    },
    {
      q: "Why not scan every vector for each query?",
      options: [
        "It’s O(n) and too slow at scale",
        "It is illegal",
        "Vectors cannot be compared",
        "It needs a GPU",
      ],
      answer: 0,
    },
    {
      q: "Which of these is a vector store?",
      options: ["Chroma", "Excel", "Bash", "JPEG"],
      answer: 0,
    },
  ],
  rag: [
    {
      q: "RAG stands for…",
      options: [
        "Random Access Gradient",
        "Retrieval-Augmented Generation",
        "Recurrent Adaptive Gating",
        "Rapid Array Grouping",
      ],
      answer: 1,
    },
    {
      q: "The main problem RAG solves is…",
      options: [
        "Slow GPUs",
        "LLMs hallucinating and being frozen in time",
        "Large file uploads",
        "Colour accuracy",
      ],
      answer: 1,
    },
    {
      q: "What is the correct RAG order?",
      options: [
        "Generate → retrieve → index",
        "Index → retrieve → augment → generate",
        "Augment → index → answer",
        "Retrieve → train → deploy",
      ],
      answer: 1,
    },
  ],
  langchain: [
    {
      q: "LangChain is best described as…",
      options: [
        "A new large language model",
        "Glue that composes prompts, models, retrievers, and tools",
        "A vector database",
        "A GPU driver",
      ],
      answer: 1,
    },
    {
      q: "In LCEL, the | operator…",
      options: [
        "Divides two numbers",
        "Pipes pieces (prompt | model | parser) together",
        "Comments out code",
        "Imports a module",
      ],
      answer: 1,
    },
    {
      q: "An agent lets the model…",
      options: [
        "Render video",
        "Call tools in a loop to take actions",
        "Train itself",
        "Compress data",
      ],
      answer: 1,
    },
  ],
};

/* ----------------------------------------------------------------------------
   Final exam — 15 questions spanning the whole curriculum. Unlocks only after
   every module quiz has been passed. Worth 10 points per correct answer (150).
---------------------------------------------------------------------------- */

export const finalExam: Question[] = [
  {
    q: "Machine learning is best described as building programs that…",
    options: [
      "Follow hand-written rules for every case",
      "Learn patterns from data instead of explicit rules",
      "Store data for fast retrieval",
      "Render user interfaces",
    ],
    answer: 1,
  },
  {
    q: "Clustering customers into groups with no labels is an example of…",
    options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Regression"],
    answer: 1,
  },
  {
    q: "A model with high bias is most likely…",
    options: ["Overfitting", "Underfitting", "Perfectly fit", "Memorising noise"],
    answer: 1,
  },
  {
    q: "Linear regression fits its line by minimising…",
    options: ["Gini impurity", "Mean squared error", "Log loss", "Inertia"],
    answer: 1,
  },
  {
    q: "In gradient descent, the learning rate controls…",
    options: [
      "The number of features",
      "The size of each parameter update step",
      "The depth of the tree",
      "The number of clusters",
    ],
    answer: 1,
  },
  {
    q: "Logistic regression turns a linear score into a probability using the…",
    options: ["ReLU function", "Sigmoid function", "Gini index", "Softmax over features"],
    answer: 1,
  },
  {
    q: "Before using KNN you should almost always…",
    options: [
      "Normalise the features to comparable scales",
      "Remove all the labels",
      "Increase the learning rate",
      "Build a dendrogram",
    ],
    answer: 0,
  },
  {
    q: "A random forest reduces variance compared with a single tree mainly by…",
    options: [
      "Growing one very deep tree",
      "Averaging many decorrelated trees",
      "Removing all randomness",
      "Using a sigmoid output",
    ],
    answer: 1,
  },
  {
    q: "Gradient boosting builds its trees…",
    options: [
      "In parallel, then averages them",
      "Sequentially, each correcting prior errors",
      "All from one bootstrap sample",
      "Without using trees",
    ],
    answer: 1,
  },
  {
    q: "K-means alternates which two steps until convergence?",
    options: [
      "Forward pass and backward pass",
      "Assign points to nearest centroid, then move centroids to the mean",
      "Split and prune",
      "Bootstrap and vote",
    ],
    answer: 1,
  },
  {
    q: "PCA is primarily used for…",
    options: ["Classification", "Dimensionality reduction", "Reinforcement learning", "Labelling data"],
    answer: 1,
  },
  {
    q: "Without non-linear activations, stacking neural-network layers collapses into…",
    options: ["A decision tree", "A single linear function", "A clustering", "A random forest"],
    answer: 1,
  },
  {
    q: "Backpropagation computes gradients using the…",
    options: ["Chain rule, working backward", "Elbow method", "Kernel trick", "Bootstrap"],
    answer: 0,
  },
  {
    q: "On heavily imbalanced data, accuracy is misleading because…",
    options: [
      "It cannot be computed",
      "Always predicting the majority class can still score high",
      "It needs probabilities",
      "It ignores true positives",
    ],
    answer: 1,
  },
  {
    q: "AUC of 0.5 means the classifier is…",
    options: ["Perfect", "No better than random", "Always overfitting", "Underfit"],
    answer: 1,
  },
];

// ---- server-side accessors -------------------------------------------------

/** Slugs of all module quizzes (excludes the final exam). */
export const MODULE_QUIZ_SLUGS: string[] = Object.keys(quizzes);

/** Full quiz (with answers) — server use only. */
export function getQuiz(slug: string): Question[] | undefined {
  if (slug === FINAL_EXAM_SLUG) return finalExam;
  return quizzes[slug];
}

/** Sanitized quiz safe to send to the browser (no answer keys). */
export function getQuizForClient(slug: string): ClientQuestion[] | undefined {
  const quiz = getQuiz(slug);
  return quiz?.map((q) => ({ q: q.q, code: q.code, options: q.options }));
}
