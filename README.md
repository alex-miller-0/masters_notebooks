## Data webpage

Below is a link to a webpage containing the data that was collected for this analysis.

http://bl.ocks.org/asmiller1989/raw/29d4829e0ac5b2e92d95/


# masters_notebooks
This is a series of iPython Notebooks covering the data analysis process for my maters thesis on Solid Oxide Fuel Cells. My goal was to discover, through a relatively small dataset, what features in a material led to fast oxide diffusion in SOFCs. I mainly used Pandas for data processing and SciKit Learn for machine learning algorithms. This was not a typical machine learning problem because I had a small amount of data and was not only interested in maximizing the fit, but also in developing a theory that was physically justifiable (i.e. one or two factors influencing diffusion modeled with a 1st, 2nd, or 3rd polynomial).

My conclusion was that the log of combined surface exchange (k*) and bulk diffusion (D*) coefficients was, for perovskites and double perovskites, explained primarily by a roughly linear function of the electron affinity for the B-site cation.

The notebooks are labeled in the order of the data analysis process. Reused custom functions can be found in sofc_func.py

## Static Notebooks:
**The following links show static versions of the notebooks. Interactive notebooks can be found in the python directory of this repository.

##### Part 1: Manual cross-validation
As an absolute beginner in machine learning techniques, I tried to cross-validate manually, which turned out to be a bad idea. I also plotted a few key features and played around with the data, setting up later notebooks. *(This was my training notebook, so you can skip it)*

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/1_manual_cv.ipynb

##### Parts 2 and 3: Leave-One-Out cross-validation and categorical variables
In this notebook, I tried Leave-One-Out cross-validation and discovered that it is vastly preferable to manual CV, especially for small data sets. I found two features that predicted the model very well. I also looked at categorical variables and found that dummy coding them resulted in sizable model improvement.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/2_leave_k_out_3_categories.ipynb

##### Part 4: Sets of quantitative variables
Here I looked more at other features to determine if they were helpful to the model or if they just overfit the data. The latter was true.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/4_quantitative_feature_sets.ipynb

##### Part 5: Finalizing the model
Similar to part 4, but here I rebuilt the model from scratch and decided to leave out one of the predictive features that was only adding ~4% to describing the variation to avoid multicollinearity problems.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/5_finalizing_the_model.ipynb

##### Part 6: Adding the temperature dimension
Because diffusion is a thermally activated process, I needed to make sure my model held up at all temperatures. The model explained less variation at lower temperatures, likely a result of extrapolation error.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/6_temperature.ipynb

##### Part 7: Extras and conclusion
Before concluding, I decided to revisit the categorical variables. Here I performed ANOVA tests and determined that two of the categories had groups that were statistically significant. However, I determined this was slightly misleading because most of the variation was captured by one subgroup. 

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/7_extras.ipynb

##### Part 8: Splitting the data
After consideration of physical mechanisms, I decided to remove Ruddlesden-Popper materials from the analysis and try to build a model separately for them. Diffusion in Perovskites and Double Perovskites occurs by an vacancy migration mechanism. In Ruddlesden-Popper, it occurs by an interstitial mechanism.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/8_separate_families.ipynb
