/* ----------------------------------------------------------------------------
   The curriculum registry. Each topic is plain data — written lesson content
   plus an optional interactive `lab` key. Adding a topic is just a new entry;
   this is the layer a database will eventually back.
---------------------------------------------------------------------------- */

export type LabKey =
  | "linear-regression"
  | "gradient-descent"
  | "logistic-regression"
  | "knn"
  | "kmeans"
  | "decision-tree"
  | "random-forest"
  | "neural-net"
  | "bias-variance"
  | "threshold";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "math"; text: string }
  | { type: "code"; text: string }
  | { type: "callout"; text: string };

export type LabCode = {
  lang: string;
  caption?: string;
  source: string;
};

export type Topic = {
  slug: string;
  title: string;
  summary: string;
  lab?: LabKey;
  labCode?: LabCode;
  content: Block[];
};

export type Category = {
  id: string;
  title: string;
  blurb: string;
  topics: Topic[];
};

export const curriculum: Category[] = [
  {
    id: "foundations",
    title: "Foundations",
    blurb: "The mental model behind every algorithm.",
    topics: [
      {
        slug: "what-is-machine-learning",
        title: "What is Machine Learning?",
        summary: "Programs that improve from data instead of explicit rules.",
        content: [
          {
            type: "p",
            text: "Machine learning is the practice of building programs that learn patterns from data rather than following rules a human wrote by hand. Instead of coding “if the email contains these words, mark it spam”, you show the model thousands of labelled emails and let it discover the pattern itself.",
          },
          { type: "h", text: "The core idea" },
          {
            type: "p",
            text: "A model is a function with adjustable parameters. Learning means searching for the parameter values that make the model’s predictions match the data as closely as possible, measured by a loss function.",
          },
          { type: "math", text: "prediction = f(input ; parameters)" },
          { type: "h", text: "When to reach for ML" },
          {
            type: "list",
            items: [
              "The rules are too complex or fuzzy to write by hand (recognising faces, translating text).",
              "The pattern changes over time and must adapt (fraud, recommendations).",
              "You have lots of examples but no closed-form formula.",
            ],
          },
          {
            type: "callout",
            text: "Rule of thumb: if you can easily write the rules yourself, you probably don’t need ML. ML earns its keep when the rules live in the data.",
          },
        ],
      },
      {
        slug: "types-of-machine-learning",
        title: "Types of Machine Learning",
        summary: "Supervised, unsupervised, and reinforcement learning.",
        content: [
          {
            type: "p",
            text: "ML problems fall into a few broad families, distinguished mainly by what kind of feedback the model gets while learning.",
          },
          { type: "h", text: "Supervised learning" },
          {
            type: "p",
            text: "Every training example comes with the correct answer (a label). The model learns to map inputs to outputs. Splits into regression (predict a number) and classification (predict a category).",
          },
          { type: "h", text: "Unsupervised learning" },
          {
            type: "p",
            text: "No labels — the model finds structure on its own: grouping similar points (clustering) or compressing data while keeping its shape (dimensionality reduction).",
          },
          { type: "h", text: "Reinforcement learning" },
          {
            type: "p",
            text: "An agent acts in an environment and learns from rewards and penalties, optimising long-term return rather than fitting a fixed dataset.",
          },
          {
            type: "list",
            items: [
              "Supervised → labelled data, predict the label.",
              "Unsupervised → unlabelled data, find structure.",
              "Reinforcement → trial and error, maximise reward.",
            ],
          },
        ],
      },
      {
        slug: "the-ml-workflow",
        title: "The ML Workflow",
        summary: "From raw data to a deployed, monitored model.",
        content: [
          {
            type: "p",
            text: "Real projects are mostly the steps around the model. Training is the part everyone pictures, but it’s often the smallest slice of the work. A typical pipeline looks like this:",
          },
          {
            type: "ol",
            items: [
              "Frame the problem — what are you predicting, and how is success measured?",
              "Collect & clean data — handle missing values, outliers, and errors.",
              "Engineer features — turn raw fields into informative inputs.",
              "Split the data — train / validation / test sets to measure honestly.",
              "Train candidate models and tune hyperparameters.",
              "Evaluate on held-out data using the right metric.",
              "Deploy, then monitor for drift and retrain as needed.",
            ],
          },
          { type: "h", text: "It’s a loop, not a line" },
          {
            type: "p",
            text: "You almost never walk through these steps once. A poor evaluation sends you back to feature engineering; a data-quality surprise sends you back to cleaning; drift in production sends you back to retraining. Treat the pipeline as a cycle you iterate on, tightening one link at a time.",
          },
          { type: "h", text: "Where the time actually goes" },
          {
            type: "p",
            text: "Surveys of working practitioners consistently put the bulk of effort in the unglamorous middle: collecting, cleaning, and labelling data. Choosing and tuning the model — the part that feels like ‘real’ ML — is usually a fraction of the schedule. Knowing this up front keeps your expectations (and estimates) honest.",
          },
          {
            type: "callout",
            text: "Garbage in, garbage out. Most accuracy gains in practice come from better data and features, not fancier models.",
          },
        ],
      },
      {
        slug: "bias-variance-tradeoff",
        title: "Bias–Variance Tradeoff",
        summary: "Why models underfit, overfit, and the sweet spot between.",
        lab: "bias-variance",
        labCode: {
          lang: "python",
          caption: "Sweep model complexity and watch train vs. test error diverge — the lab plots exactly this.",
          source: `# Error = Bias^2 + Variance + irreducible noise
for degree in range(1, 16):
    model = PolynomialModel(degree).fit(X_train, y_train)
    train_err = mse(model.predict(X_train), y_train)
    test_err  = mse(model.predict(X_test),  y_test)
    # train_err keeps falling; test_err dips, then climbs -> overfitting`,
        },
        content: [
          {
            type: "p",
            text: "A model’s error on unseen data decomposes into three parts: bias, variance, and irreducible noise.",
          },
          { type: "math", text: "Error = Bias² + Variance + Irreducible noise" },
          {
            type: "list",
            items: [
              "High bias (underfitting): the model is too simple to capture the pattern — wrong on both training and test data.",
              "High variance (overfitting): the model memorises noise in the training data — great on train, poor on test.",
              "Irreducible noise: randomness no model can remove.",
            ],
          },
          {
            type: "p",
            text: "Increasing model complexity lowers bias but raises variance. The goal is the balance point with the lowest total error on unseen data.",
          },
          {
            type: "callout",
            text: "See it live in the Decision Trees and Neural Networks labs: crank the depth or hidden units and watch the boundary go from too smooth to overfit.",
          },
        ],
      },
      {
        slug: "overfitting-and-regularization",
        title: "Overfitting & Regularization",
        summary: "Keeping models from memorising the training set.",
        lab: "bias-variance",
        labCode: {
          lang: "python",
          caption: "λ trades data fit against weight size — slide it in the lab to watch the boundary smooth out.",
          source: `# Penalise large weights so the model stays simple
def loss(w, X, y, lam):
    data_loss = mse(predict(w, X), y)
    penalty   = lam * sum(wj ** 2 for wj in w)   # L2 (ridge)
    return data_loss + penalty
# lam too small -> overfit; too large -> underfit`,
        },
        content: [
          {
            type: "p",
            text: "Overfitting happens when a model fits the noise in the training data instead of the underlying signal. It shows up as a large gap between training and validation performance.",
          },
          { type: "h", text: "Ways to fight it" },
          {
            type: "list",
            items: [
              "Get more (or cleaner) training data.",
              "Reduce model complexity — fewer features, shallower trees.",
              "Regularization — penalise large weights so the model stays simple.",
              "Early stopping — halt training when validation error starts rising.",
              "Cross-validation — tune choices without touching the test set.",
            ],
          },
          { type: "h", text: "Regularization in one line" },
          { type: "math", text: "Loss = DataLoss + λ · Penalty(weights)" },
          {
            type: "p",
            text: "λ controls the strength: too small and you overfit, too large and you underfit. It’s itself a hyperparameter to tune.",
          },
        ],
      },
      {
        slug: "data-preprocessing",
        title: "Data Preprocessing & Feature Scaling",
        summary: "Turning messy raw data into something a model can learn from.",
        content: [
          {
            type: "p",
            text: "Models don’t see the world — they see a matrix of numbers. Preprocessing is the work of turning raw, messy records into that clean numeric matrix, and it routinely matters more to the final result than the choice of algorithm.",
          },
          { type: "h", text: "Handling missing values" },
          {
            type: "p",
            text: "Few datasets are complete. You can drop rows or columns with too many gaps, or impute — fill the holes with the column mean/median, the most frequent category, or a model-based estimate. Whatever you choose, learn the fill values from the training set only, then apply them to validation and test.",
          },
          { type: "h", text: "Encoding categories" },
          {
            type: "p",
            text: "Algorithms need numbers, so non-numeric fields must be encoded. One-hot encoding turns a category with k values into k binary columns; ordinal encoding maps ordered categories (small/medium/large) to integers. Avoid assigning arbitrary integers to unordered categories — the model will read a fake ranking into them.",
          },
          { type: "h", text: "Scaling features" },
          {
            type: "p",
            text: "When one feature ranges 0–1 and another ranges 0–100,000, the larger one dominates any distance or gradient. Two standard fixes put features on comparable footing:",
          },
          { type: "math", text: "Standardise: z = (x − μ) / σ      Normalise: x' = (x − min) / (max − min)" },
          {
            type: "list",
            items: [
              "Standardisation (z-score) centres each feature at 0 with unit variance — the usual default.",
              "Min–max normalisation squashes values into a fixed range like [0, 1].",
              "Distance- and gradient-based models (KNN, SVM, k-means, neural nets) need scaling; tree-based models are largely immune.",
            ],
          },
          {
            type: "callout",
            text: "Golden rule: fit every transformer (imputer, encoder, scaler) on the training data only. Touching the test set while preprocessing leaks information and inflates your scores.",
          },
        ],
      },
    ],
  },

  {
    id: "regression",
    title: "Regression",
    blurb: "Predicting continuous values.",
    topics: [
      {
        slug: "linear-regression",
        title: "Linear Regression",
        summary: "Fit a straight line by minimising squared error.",
        lab: "linear-regression",
        labCode: {
          lang: "python",
          caption: "Press “Fit” in the lab to jump straight to this least-squares line.",
          source: `# Closed-form least-squares fit for one feature
def fit(x, y):
    w = covariance(x, y) / variance(x)   # slope
    b = mean(y) - w * mean(x)            # intercept
    return w, b

def predict(x, w, b):
    return w * x + b`,
        },
        content: [
          {
            type: "p",
            text: "Linear regression models the target as a weighted sum of the inputs plus a bias. With one feature it’s just a line: choose the slope and intercept that sit closest to the data.",
          },
          { type: "math", text: "ŷ = w·x + b" },
          { type: "h", text: "What “closest” means" },
          {
            type: "p",
            text: "We measure fit with mean squared error (MSE) — the average of the squared vertical gaps (residuals) between each point and the line.",
          },
          { type: "math", text: "MSE = (1/n) · Σ (ŷᵢ − yᵢ)²" },
          {
            type: "p",
            text: "For one feature there’s a closed-form solution: the slope is the covariance of x and y divided by the variance of x, and the intercept passes through the means.",
          },
          {
            type: "callout",
            text: "In the lab, drag the slope and intercept to shrink the residual whiskers, then press Fit to jump to the exact least-squares line.",
          },
        ],
      },
      {
        slug: "gradient-descent",
        title: "Gradient Descent",
        summary: "The optimiser that powers most of ML.",
        lab: "gradient-descent",
        labCode: {
          lang: "python",
          caption: "The exact loop the lab animates — every Step is one iteration.",
          source: `def gradient_descent(grad, theta, lr, steps):
    history = [theta]
    for _ in range(steps):
        theta -= lr * grad(theta)   # step against the slope
        history.append(theta)
    return history`,
        },
        content: [
          {
            type: "p",
            text: "Most models can’t be solved with a neat formula, so we minimise the loss iteratively. Gradient descent repeatedly nudges the parameters in the direction that decreases the loss fastest — the negative gradient.",
          },
          { type: "math", text: "θ ← θ − η · ∇L(θ)" },
          {
            type: "p",
            text: "η is the learning rate: the size of each step. It is the single most important knob in the algorithm.",
          },
          {
            type: "list",
            items: [
              "Too small → painfully slow convergence.",
              "Just right → smooth, quick descent to the minimum.",
              "Too large → the steps overshoot, oscillate, then diverge.",
            ],
          },
          { type: "h", text: "Variants" },
          {
            type: "p",
            text: "Batch GD uses all data per step; stochastic GD uses one sample; mini-batch (the usual choice) uses a small group — trading noise for speed.",
          },
          {
            type: "callout",
            text: "Push the learning rate past ~2 in the lab and watch the ball climb out of the bowl instead of settling at the bottom.",
          },
        ],
      },
      {
        slug: "polynomial-regression",
        title: "Polynomial Regression",
        summary: "Curving the line by adding powers of x.",
        content: [
          {
            type: "p",
            text: "When data bends, a straight line underfits. Polynomial regression adds powers of the input as extra features, so the same linear machinery can fit curves.",
          },
          { type: "math", text: "ŷ = w₀ + w₁x + w₂x² + … + wₖxᵏ" },
          { type: "h", text: "Why it’s still ‘linear’" },
          {
            type: "p",
            text: "The curve is non-linear in x, but the model is linear in the weights — and that’s the part the algorithm solves for. You simply build new columns (x², x³, …) and hand them to ordinary linear regression. The same closed-form or gradient-descent solver works unchanged; only the feature matrix grew wider.",
          },
          { type: "h", text: "Choosing the degree" },
          {
            type: "p",
            text: "The degree k is a complexity dial, and it sits right on the bias–variance tradeoff. Degree 1 is the straight line (high bias); a high degree threads every training point but oscillates between them (high variance). Pick k by validation error, not by how well it hugs the training data.",
          },
          {
            type: "list",
            items: [
              "Low degree → smooth but may miss real curvature (underfit).",
              "Right degree → captures the trend, ignores the noise.",
              "High degree → perfect on train, wild between points (overfit).",
            ],
          },
          {
            type: "p",
            text: "Two practical cautions: high powers blow up in scale, so standardise your features first; and pairing polynomial features with a little regularization (ridge) keeps the wiggles in check.",
          },
          {
            type: "callout",
            text: "High degrees fit the training points perfectly but wiggle wildly between them — a textbook example of variance and overfitting.",
          },
        ],
      },
      {
        slug: "regularized-regression",
        title: "Ridge & Lasso Regression",
        summary: "L2 and L1 penalties that tame the weights.",
        content: [
          {
            type: "p",
            text: "Regularized regression adds a penalty on the weights to the squared-error loss, discouraging the model from relying too heavily on any feature.",
          },
          { type: "h", text: "Ridge (L2)" },
          { type: "math", text: "Loss = MSE + λ · Σ wⱼ²" },
          {
            type: "p",
            text: "Shrinks weights smoothly toward zero (but rarely exactly zero). Great when many features each contribute a little.",
          },
          { type: "h", text: "Lasso (L1)" },
          { type: "math", text: "Loss = MSE + λ · Σ |wⱼ|" },
          {
            type: "p",
            text: "Drives some weights to exactly zero, performing automatic feature selection. Useful when you suspect only a few features matter.",
          },
        ],
      },
    ],
  },

  {
    id: "classification",
    title: "Classification",
    blurb: "Predicting discrete categories.",
    topics: [
      {
        slug: "logistic-regression",
        title: "Logistic Regression",
        summary: "Turn a linear score into a class probability.",
        lab: "logistic-regression",
        labCode: {
          lang: "python",
          caption: "Steepness scales w; the threshold slides the 0.5 cutoff — both are live in the lab.",
          source: `def sigmoid(z):
    return 1 / (1 + exp(-z))

def predict_proba(x, w, b):
    return sigmoid(w @ x + b)        # probability of the positive class

def predict(x, w, b, threshold=0.5):
    return predict_proba(x, w, b) > threshold`,
        },
        content: [
          {
            type: "p",
            text: "Despite the name, logistic regression is a classifier. It computes a linear score, then squashes it through the sigmoid function into a probability between 0 and 1.",
          },
          { type: "math", text: "p = σ(w·x + b),   σ(z) = 1 / (1 + e⁻ᶻ)" },
          {
            type: "p",
            text: "Predict the positive class when p > 0.5 — i.e. wherever the linear score crosses zero. That crossing is the decision boundary.",
          },
          { type: "h", text: "Training" },
          {
            type: "p",
            text: "We fit the weights by minimising log loss (binary cross-entropy), which heavily penalises confident wrong predictions. There’s no closed form, so we use gradient descent.",
          },
          {
            type: "callout",
            text: "In the lab, the steepness controls how sharply the sigmoid turns; the threshold slides the decision boundary left and right to maximise accuracy.",
          },
        ],
      },
      {
        slug: "k-nearest-neighbors",
        title: "K-Nearest Neighbors",
        summary: "Classify a point by a vote of its closest neighbours.",
        lab: "knn",
        labCode: {
          lang: "python",
          caption: "Move the query point or change k in the lab to re-run this vote.",
          source: `def knn_predict(query, X, y, k):
    dists = [(distance(query, xi), yi) for xi, yi in zip(X, y)]
    nearest = sorted(dists)[:k]      # the k closest points
    votes = [yi for _, yi in nearest]
    return majority(votes)           # most common label wins`,
        },
        content: [
          {
            type: "p",
            text: "KNN is the simplest classifier there is: to label a new point, find the k closest training points and take a majority vote. There’s no training phase — the data is the model.",
          },
          { type: "h", text: "Choosing k" },
          {
            type: "list",
            items: [
              "Small k → flexible but noisy; a single odd neighbour can flip the prediction.",
              "Large k → smoother boundaries but can wash out genuine local structure.",
              "Use an odd k for two classes to avoid ties.",
            ],
          },
          {
            type: "p",
            text: "Because it relies on distance, KNN needs features on comparable scales — always normalise first. It also slows down as the dataset grows, since every prediction searches all points.",
          },
          {
            type: "callout",
            text: "Click around the lab to move the query point and change k — watch the vote, and the prediction, flip near the boundary.",
          },
        ],
      },
      {
        slug: "decision-trees",
        title: "Decision Trees",
        summary: "A flowchart of yes/no splits learned from data.",
        lab: "decision-tree",
        labCode: {
          lang: "python",
          caption: "Raise max depth in the lab and watch these splits fragment the space.",
          source: `def gini(labels):
    return 1 - sum(p ** 2 for p in class_proportions(labels))

def best_split(X, y):
    # pick the feature + threshold with the biggest drop in impurity
    return min(all_splits(X), key=lambda s: weighted_gini(s, y))
# recurse on each side until pure or max_depth is reached`,
        },
        content: [
          {
            type: "p",
            text: "A decision tree splits the data with a sequence of threshold questions (“is x > 3?”), each split carving the feature space into rectangles. To predict, you follow the answers down to a leaf and read off the majority class there.",
          },
          { type: "h", text: "How splits are chosen" },
          {
            type: "p",
            text: "At each node the tree picks the feature and threshold that most reduce impurity — how mixed the classes are. Gini impurity is the common measure:",
          },
          { type: "math", text: "Gini = 1 − Σ pₖ²" },
          {
            type: "p",
            text: "Lower is purer. The split with the biggest weighted drop in impurity wins, and the process repeats until the tree hits its max depth or the nodes are pure.",
          },
          {
            type: "callout",
            text: "Trees overfit easily — push max depth up in the lab and watch the regions fragment to chase individual noisy points.",
          },
        ],
      },
      {
        slug: "random-forest",
        title: "Random Forest",
        summary: "Many decorrelated trees voting together.",
        lab: "random-forest",
        labCode: {
          lang: "python",
          caption: "Slide the tree count up in the lab — more votes, smoother boundary.",
          source: `def random_forest(X, y, n_trees):
    trees = []
    for _ in range(n_trees):
        Xs, ys = bootstrap_sample(X, y)   # random draw with replacement
        trees.append(DecisionTree(max_features="sqrt").fit(Xs, ys))
    return trees

def predict(trees, x):
    return majority(tree.predict(x) for tree in trees)   # average the votes`,
        },
        content: [
          {
            type: "p",
            text: "A single deep tree is accurate but unstable. A random forest builds many trees and averages their votes, trading a bit of bias for a big drop in variance.",
          },
          { type: "h", text: "Two sources of randomness" },
          {
            type: "list",
            items: [
              "Bagging — each tree trains on a bootstrap sample (random draw with replacement) of the data.",
              "Feature randomness — each split considers a random subset of features, so trees don’t all look alike.",
            ],
          },
          {
            type: "p",
            text: "Because the trees make different mistakes, their errors cancel when you average them. The ensemble boundary is far smoother and generalises better than any single tree.",
          },
          {
            type: "callout",
            text: "Start with 1 tree in the lab, then slide up to 25 — the blocky overfit boundary melts into a clean, stable one.",
          },
        ],
      },
      {
        slug: "naive-bayes",
        title: "Naive Bayes",
        summary: "Probabilistic classification via Bayes’ theorem.",
        content: [
          {
            type: "p",
            text: "Naive Bayes applies Bayes’ theorem with a strong simplifying assumption: that all features are independent given the class. Crude, but remarkably effective — especially for text.",
          },
          { type: "h", text: "From Bayes’ theorem to a classifier" },
          {
            type: "p",
            text: "Bayes’ theorem flips a conditional probability: it turns ‘how likely is this data given the class’ into ‘how likely is the class given this data’. The naive step assumes the features don’t interact, so the joint likelihood becomes a simple product of per-feature terms.",
          },
          { type: "math", text: "P(class | x) ∝ P(class) · Π P(xⱼ | class)" },
          {
            type: "p",
            text: "You estimate each term by counting frequencies in the training data, then pick the class with the highest posterior probability. It’s fast, needs little data, and is a strong baseline for spam filtering and document classification.",
          },
          { type: "h", text: "Practical details" },
          {
            type: "list",
            items: [
              "Variants match the data: multinomial for word counts, Bernoulli for present/absent flags, Gaussian for continuous features.",
              "Laplace (add-one) smoothing avoids zero probabilities when a feature value never appeared with a class in training.",
              "Work in log-space — sum log-probabilities instead of multiplying — to dodge floating-point underflow on long documents.",
            ],
          },
          {
            type: "callout",
            text: "The independence assumption is almost always false, yet the predicted class is often right even when the probabilities are miscalibrated.",
          },
        ],
      },
      {
        slug: "support-vector-machines",
        title: "Support Vector Machines",
        summary: "Find the widest margin between classes.",
        content: [
          {
            type: "p",
            text: "An SVM looks for the decision boundary with the largest margin — the widest possible gap to the nearest points of either class. Those nearest points are the support vectors that define the boundary.",
          },
          { type: "h", text: "The kernel trick" },
          {
            type: "p",
            text: "When classes aren’t linearly separable, kernels implicitly map the data into a higher-dimensional space where a straight boundary works — without ever computing the new coordinates explicitly.",
          },
          {
            type: "list",
            items: [
              "Linear kernel — fast, for roughly separable data.",
              "RBF (Gaussian) kernel — flexible, curved boundaries.",
              "Polynomial kernel — interactions up to a chosen degree.",
            ],
          },
          { type: "h", text: "Soft margins and the C knob" },
          {
            type: "p",
            text: "Real data is rarely cleanly separable, so SVMs allow a few points to sit inside or across the margin and pay a penalty for it. The hyperparameter C sets how harsh that penalty is — it’s the model’s bias–variance dial.",
          },
          {
            type: "list",
            items: [
              "Small C → a wide, forgiving margin that tolerates errors (more bias, less variance).",
              "Large C → a narrow margin that insists on classifying training points correctly (less bias, more variance).",
              "γ (for the RBF kernel) sets each point’s reach: high γ means wiggly, local boundaries.",
            ],
          },
          {
            type: "p",
            text: "Because SVMs rely on distances and dot products, always standardise your features first, and tune C and γ together with cross-validation.",
          },
          {
            type: "callout",
            text: "Only the support vectors matter: move or delete a point far from the boundary and the solution doesn’t change at all.",
          },
        ],
      },
      {
        slug: "gradient-boosting",
        title: "Gradient Boosting",
        summary: "Building a strong model from many tiny corrections.",
        content: [
          {
            type: "p",
            text: "Random forests build many strong trees in parallel and average them. Boosting takes the opposite tack: it builds many weak trees in sequence, where each new tree focuses on the mistakes the ensemble has made so far.",
          },
          { type: "h", text: "Learning from residuals" },
          {
            type: "p",
            text: "Start with a constant prediction. Compute the errors (residuals) it makes, then fit a small tree to predict those errors and add a shrunken version of it to the model. Repeat: every round nudges the predictions a little closer to the targets.",
          },
          { type: "math", text: "Fₘ(x) = Fₘ₋₁(x) + η · hₘ(x)" },
          {
            type: "p",
            text: "The ‘gradient’ in the name is the insight that fitting the residuals is really doing gradient descent — each tree hₘ points down the slope of the loss function, and the model takes a step of size η.",
          },
          { type: "h", text: "The knobs that matter" },
          {
            type: "list",
            items: [
              "Learning rate (η) — smaller steps generalise better but need more trees.",
              "Number of trees — too many overfits; tune with early stopping on a validation set.",
              "Tree depth — boosting uses shallow trees (often depth 2–6) as the weak learners.",
            ],
          },
          {
            type: "p",
            text: "Modern libraries — XGBoost, LightGBM, CatBoost — add regularization, clever split-finding, and speed. On tabular data they’re often the single strongest off-the-shelf model.",
          },
          {
            type: "callout",
            text: "Forests reduce variance by averaging independent trees; boosting reduces bias by stacking dependent ones. Same ingredient (trees), opposite strategy.",
          },
        ],
      },
    ],
  },

  {
    id: "unsupervised",
    title: "Unsupervised Learning",
    blurb: "Finding structure without labels.",
    topics: [
      {
        slug: "k-means-clustering",
        title: "K-Means Clustering",
        summary: "Group points around k moving centroids.",
        lab: "kmeans",
        labCode: {
          lang: "python",
          caption: "Step the lab to watch the assign/update cycle this loop runs.",
          source: `def kmeans(X, k):
    centroids = random_points(X, k)
    while True:
        labels = [nearest_centroid(x, centroids) for x in X]      # assign
        new = [mean(points_in(c, X, labels)) for c in range(k)]   # update
        if new == centroids:        # converged
            break
        centroids = new
    return labels, centroids`,
        },
        content: [
          {
            type: "p",
            text: "K-means partitions data into k clusters by alternating two steps until nothing moves:",
          },
          {
            type: "ol",
            items: [
              "Assign — attach each point to its nearest centroid.",
              "Update — move each centroid to the mean of its assigned points.",
            ],
          },
          {
            type: "p",
            text: "This minimises inertia — the total squared distance from points to their centroid. It always converges, though only to a local optimum, so the random initialisation matters.",
          },
          { type: "math", text: "Inertia = Σ ‖xᵢ − μ(cluster of i)‖²" },
          {
            type: "callout",
            text: "Pick k with the elbow method: plot inertia versus k and look for the bend where extra clusters stop helping much.",
          },
        ],
      },
      {
        slug: "hierarchical-clustering",
        title: "Hierarchical Clustering",
        summary: "Build a tree of nested clusters.",
        content: [
          {
            type: "p",
            text: "Instead of fixing k upfront, hierarchical clustering builds a whole hierarchy. Agglomerative (bottom-up) clustering starts with every point as its own cluster and repeatedly merges the two closest, producing a dendrogram.",
          },
          { type: "h", text: "Reading the dendrogram" },
          {
            type: "p",
            text: "A dendrogram is a tree whose branch heights show how far apart clusters were when they merged — short joins mean tight, similar groups; tall joins mean you’re fusing things that don’t really belong together. Slice the tree horizontally at any height and the number of branches you cut is your number of clusters, so you choose k after seeing the structure, not before.",
          },
          { type: "h", text: "Linkage: how to measure cluster distance" },
          {
            type: "list",
            items: [
              "Single — distance between the two nearest points; finds stringy, chain-like shapes but is prone to ‘chaining’.",
              "Complete — distance between the two farthest points; favours compact, equal-sized blobs.",
              "Average — mean distance between all pairs; a middle ground.",
              "Ward — merges the pair that least increases total within-cluster variance; usually the most balanced default.",
            ],
          },
          {
            type: "p",
            text: "There’s also a top-down (divisive) variant that starts from one cluster and splits, but agglomerative is far more common in practice.",
          },
          {
            type: "callout",
            text: "No need to choose k in advance, but it’s O(n²) or worse — best for small to medium datasets.",
          },
        ],
      },
      {
        slug: "pca",
        title: "Principal Component Analysis",
        summary: "Compress data onto its directions of greatest variance.",
        content: [
          {
            type: "p",
            text: "PCA finds new axes — principal components — ordered by how much variance they capture. Keeping the first few lets you compress high-dimensional data while preserving most of its shape.",
          },
          { type: "h", text: "How it works" },
          {
            type: "ol",
            items: [
              "Centre the data (subtract the mean of each feature).",
              "Compute the covariance matrix.",
              "Take its eigenvectors — these are the principal components.",
              "Project the data onto the top components.",
            ],
          },
          {
            type: "p",
            text: "Common uses: visualising high-dimensional data in 2D, speeding up downstream models, and removing correlated noise.",
          },
        ],
      },
      {
        slug: "dbscan",
        title: "DBSCAN: Density-Based Clustering",
        summary: "Find clusters of any shape and flag the outliers.",
        content: [
          {
            type: "p",
            text: "K-means assumes clusters are round blobs and forces every point into one. DBSCAN drops both assumptions: it grows clusters wherever points are packed densely, can trace arbitrary shapes, and leaves sparse points labelled as noise.",
          },
          { type: "h", text: "Two parameters" },
          {
            type: "list",
            items: [
              "ε (eps) — the radius that defines a point’s neighbourhood.",
              "minPts — how many neighbours a point needs within ε to count as ‘dense’.",
            ],
          },
          { type: "h", text: "Three kinds of point" },
          {
            type: "list",
            items: [
              "Core point — has at least minPts neighbours within ε; the dense interior of a cluster.",
              "Border point — within ε of a core point but not dense itself; the cluster’s edge.",
              "Noise point — neither; reported as an outlier rather than forced into a cluster.",
            ],
          },
          {
            type: "p",
            text: "Clusters form by connecting core points that are within ε of each other and pulling in their borders, so a cluster is exactly a connected region of high density. The number of clusters falls out of the data — you never specify k.",
          },
          { type: "h", text: "When to reach for it" },
          {
            type: "p",
            text: "DBSCAN shines on clusters with odd shapes (crescents, rings) and on data with genuine outliers. Its weak spot is varying density: a single ε can’t fit clusters that are tight in one place and loose in another. Scale your features first, since ε is a distance.",
          },
          {
            type: "callout",
            text: "Pick minPts first (a common default is twice the number of dimensions), then read ε off a k-distance plot — the ‘elbow’ marks where density drops off.",
          },
        ],
      },
    ],
  },

  {
    id: "neural-networks",
    title: "Neural Networks",
    blurb: "Stacking simple units into powerful models.",
    topics: [
      {
        slug: "the-perceptron",
        title: "The Perceptron",
        summary: "The single neuron everything is built from.",
        content: [
          {
            type: "p",
            text: "A perceptron is one artificial neuron: it takes a weighted sum of its inputs, adds a bias, and passes the result through an activation function. It’s the atom every neural network is built from.",
          },
          { type: "math", text: "output = activation(Σ wⱼxⱼ + b)" },
          { type: "h", text: "What the parts do" },
          {
            type: "list",
            items: [
              "Weights — how much each input pushes the output up or down; learning means tuning these.",
              "Bias — shifts the threshold so the neuron can fire even when all inputs are zero.",
              "Activation — the original perceptron used a hard step (fire / don’t fire); modern neurons use smooth functions so they’re differentiable.",
            ],
          },
          { type: "h", text: "Geometry: it draws a line" },
          {
            type: "p",
            text: "The weighted sum equals zero along a straight line (a hyperplane in higher dimensions). On one side the neuron outputs ‘positive’, on the other ‘negative’ — so a single perceptron is exactly a linear classifier.",
          },
          { type: "h", text: "The XOR wall" },
          {
            type: "p",
            text: "That linearity is also the limit. XOR — true when exactly one input is on — can’t be separated by any single straight line, and in 1969 this famously stalled the field. The fix is to stack neurons into layers with non-linear activations, which is precisely what a multi-layer network does.",
          },
          {
            type: "callout",
            text: "Stacking neurons with non-linear activations is exactly what lets a network bend the boundary — see the Neural Networks lab.",
          },
        ],
      },
      {
        slug: "neural-networks",
        title: "Neural Networks",
        summary: "Layers of neurons learning non-linear boundaries.",
        lab: "neural-net",
        labCode: {
          lang: "python",
          caption: "Add hidden units in the lab to give this forward pass more folds.",
          source: `def forward(x, layers, out):
    a = x
    for W, b in layers:
        a = relu(W @ a + b)      # each hidden layer adds a fold
    return sigmoid(out @ a)      # final layer -> probability
# train with backprop: forward, backward, update`,
        },
        content: [
          {
            type: "p",
            text: "A neural network chains layers of neurons. Each hidden layer transforms its inputs, and stacking non-linear layers lets the network represent boundaries that no single line could.",
          },
          { type: "h", text: "Forward pass" },
          {
            type: "p",
            text: "Data flows input → hidden layers → output, each layer applying weights, a bias, and a non-linear activation. The final layer produces the prediction.",
          },
          { type: "h", text: "Why hidden units matter" },
          {
            type: "p",
            text: "Each hidden unit adds a fold to the decision surface. Too few and the network can’t separate the classes; enough and it wraps cleanly around them.",
          },
          {
            type: "callout",
            text: "In the lab, set hidden units to 1–2 and it can’t solve the XOR pattern. Bump it to 6+ and watch the boundary curve into place.",
          },
        ],
      },
      {
        slug: "backpropagation",
        title: "Backpropagation",
        summary: "How networks compute their gradients.",
        content: [
          {
            type: "p",
            text: "Backpropagation is how a network figures out which way to nudge every weight. After a forward pass computes the loss, the error is propagated backward layer by layer using the chain rule of calculus.",
          },
          {
            type: "ol",
            items: [
              "Forward pass — compute the prediction and the loss.",
              "Backward pass — compute the gradient of the loss w.r.t. each weight, from output back to input.",
              "Update — take a gradient-descent step on every weight.",
            ],
          },
          {
            type: "p",
            text: "Because the chain rule reuses intermediate results, backprop computes all gradients in roughly the cost of one extra forward pass — what makes training deep networks feasible.",
          },
          {
            type: "callout",
            text: "The Neural Networks lab runs real backprop in your browser — every Train step is a forward pass, a backward pass, and a weight update.",
          },
        ],
      },
      {
        slug: "activation-functions",
        title: "Activation Functions",
        summary: "The non-linearities that give networks their power.",
        content: [
          {
            type: "p",
            text: "Without a non-linear activation, stacking layers collapses into a single linear function. Activations are what let networks model curves and interactions.",
          },
          {
            type: "list",
            items: [
              "ReLU — max(0, z). Fast, the default for hidden layers; can ‘die’ if always negative.",
              "Sigmoid — squashes to (0,1); used for binary output probabilities.",
              "Tanh — squashes to (−1,1); zero-centred, often better than sigmoid in hidden layers.",
              "Softmax — turns a vector of scores into a probability distribution for multi-class output.",
            ],
          },
          {
            type: "callout",
            text: "Rule of thumb: ReLU for hidden layers, sigmoid/softmax at the output depending on the number of classes.",
          },
        ],
      },
    ],
  },

  {
    id: "evaluation",
    title: "Model Evaluation",
    blurb: "Measuring whether a model actually works.",
    topics: [
      {
        slug: "train-test-split-and-cross-validation",
        title: "Train/Test Split & Cross-Validation",
        summary: "Estimating performance on data the model hasn’t seen.",
        content: [
          {
            type: "p",
            text: "You can’t judge a model on the data it trained on — it has already seen the answers. Hold out a test set and only touch it once, at the very end.",
          },
          { type: "h", text: "The three-way split" },
          {
            type: "list",
            items: [
              "Training set — fit the model’s parameters.",
              "Validation set — tune hyperparameters and pick models.",
              "Test set — the final, untouched estimate of real-world performance.",
            ],
          },
          { type: "h", text: "k-fold cross-validation" },
          {
            type: "p",
            text: "When data is scarce, split it into k folds, train on k−1 and validate on the rest, rotating through all folds. Averaging the scores gives a more reliable estimate than a single split.",
          },
        ],
      },
      {
        slug: "confusion-matrix",
        title: "The Confusion Matrix",
        summary: "The four outcomes behind every classification metric.",
        lab: "threshold",
        labCode: {
          lang: "python",
          caption: "Drag the threshold in the lab to move counts between these four cells.",
          source: `def confusion(y_true, y_pred):
    TP = sum(t == 1 and p == 1 for t, p in zip(y_true, y_pred))
    FP = sum(t == 0 and p == 1 for t, p in zip(y_true, y_pred))
    FN = sum(t == 1 and p == 0 for t, p in zip(y_true, y_pred))
    TN = sum(t == 0 and p == 0 for t, p in zip(y_true, y_pred))
    return TP, FP, FN, TN

accuracy = (TP + TN) / (TP + FP + FN + TN)`,
        },
        content: [
          {
            type: "p",
            text: "For a binary classifier, every prediction is one of four outcomes. The confusion matrix tallies them:",
          },
          {
            type: "list",
            items: [
              "True Positive (TP) — predicted positive, actually positive.",
              "False Positive (FP) — predicted positive, actually negative (a false alarm).",
              "False Negative (FN) — predicted negative, actually positive (a miss).",
              "True Negative (TN) — predicted negative, actually negative.",
            ],
          },
          {
            type: "p",
            text: "Accuracy = (TP + TN) / total. But on imbalanced data accuracy lies — a detector that always says ‘negative’ can score 99% while catching nothing. That’s why we need the metrics that follow.",
          },
        ],
      },
      {
        slug: "precision-recall-f1",
        title: "Precision, Recall & F1",
        summary: "Trading false alarms against misses.",
        lab: "threshold",
        labCode: {
          lang: "python",
          caption: "Slide the threshold in the lab and watch precision and recall trade off.",
          source: `precision = TP / (TP + FP)   # of flagged positives, how many are real
recall    = TP / (TP + FN)   # of real positives, how many we caught
f1 = 2 * precision * recall / (precision + recall)   # harmonic mean`,
        },
        content: [
          {
            type: "p",
            text: "Precision and recall look at the positive class from two angles.",
          },
          { type: "math", text: "Precision = TP / (TP + FP)" },
          { type: "math", text: "Recall = TP / (TP + FN)" },
          {
            type: "list",
            items: [
              "Precision — of everything flagged positive, how much really is? (Cost of false alarms.)",
              "Recall — of all real positives, how many did we catch? (Cost of misses.)",
            ],
          },
          {
            type: "p",
            text: "They trade off against each other. The F1 score is their harmonic mean, a single number that rewards balancing both.",
          },
          { type: "math", text: "F1 = 2 · (Precision · Recall) / (Precision + Recall)" },
        ],
      },
      {
        slug: "roc-and-auc",
        title: "ROC Curve & AUC",
        summary: "Performance across every decision threshold.",
        lab: "threshold",
        labCode: {
          lang: "python",
          caption: "Sweeping the lab's threshold traces one point per setting along this curve.",
          source: `def roc_curve(scores, y_true):
    points = []
    for thr in sorted(set(scores), reverse=True):
        pred = [s >= thr for s in scores]
        tpr = recall(y_true, pred)     # true-positive rate
        fpr = fall_out(y_true, pred)   # false-positive rate
        points.append((fpr, tpr))
    return points                      # AUC = area under these points`,
        },
        content: [
          {
            type: "p",
            text: "A classifier outputs a score; the threshold turns it into a decision. The ROC curve plots the true-positive rate against the false-positive rate as you sweep that threshold across all values.",
          },
          {
            type: "p",
            text: "AUC — the area under the ROC curve — summarises it in one number: the probability that the model ranks a random positive above a random negative.",
          },
          {
            type: "list",
            items: [
              "AUC = 1.0 — perfect separation.",
              "AUC = 0.5 — no better than random guessing.",
              "Threshold-independent, so it’s great for comparing models.",
            ],
          },
        ],
      },
    ],
  },
];

// ---- derived lookups -------------------------------------------------------

export const allTopics: Topic[] = curriculum.flatMap((c) => c.topics);

export function getTopic(slug: string): Topic | undefined {
  return allTopics.find((t) => t.slug === slug);
}

export function topicCategory(slug: string): Category | undefined {
  return curriculum.find((c) => c.topics.some((t) => t.slug === slug));
}

export function adjacentTopics(slug: string): {
  prev?: Topic;
  next?: Topic;
} {
  const i = allTopics.findIndex((t) => t.slug === slug);
  return {
    prev: i > 0 ? allTopics[i - 1] : undefined,
    next: i >= 0 && i < allTopics.length - 1 ? allTopics[i + 1] : undefined,
  };
}

export const FIRST_TOPIC = allTopics[0].slug;
