## Data webpage

Below is a link to a webpage containing the data that was collected for this analysis.

http://bl.ocks.org/asmiller1989/raw/29d4829e0ac5b2e92d95/


# masters_notebooks
This is a series of iPython Notebooks covering the data analysis process for my maters thesis on Solid Oxide Fuel Cells. My goal was to discover, through a relatively small dataset, what features in a material led to fast oxide diffusion in SOFCs. I mainly used Pandas for data processing and SciKit Learn for machine learning algorithms. This was not a typical machine learning problem because I had a small amount of data and was not interested in maximizing the fit. I was instead interested in developing some sort of a theory that was physically justifiable (i.e. one or two factors influencing diffusion in a 1st, 2nd, or 3rd polynomial). I did find that the best fit to the data was with a ~7th order polynomial, but since this was created with regularization, I reduced it down to a third order polynomial model.

My conclusion was that the log of combined surface exchange and bulk diffusion coefficients was predicted by a function of the electron affinity of the B-site cation.

The notebooks are labeled in the order of the data analysis process. Reused custom functions can be found in sofc_func.py

## Static Notebooks:
**The following links show static versions of the notebooks. Interactive notebooks can be found in the python directory of this repository.

##### Part 1: Manual cross-validation
As an absolute beginner in machine learning techniques, I tried to cross-validate manually, which turned out to be a bad idea. I also plotted a few key features and played around with the data, setting up later notebooks. *(This was my training notebook, so you can skip it)*

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/1_manual_cv.ipynb

##### Parts 2 and 3: Leave-One-Out cross-validation and categorical variables
In this notebook, I discovered Leave-One-Out cross-validation and discovered that it is vastly preferable to manual CV, especially for small data sets. I found two features that predicted the model very well. I also looked at categorical variables and found they added virtually nothing to the variation that was being captured by my model. 

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/2_leave_k_out_3_categories.ipynb

##### Part 4: Sets of quantitative variables
Here I looked more at other features to determine if they were helpful to the model or if they just overfit it. Turns out the latter was true.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/4_quantitative_feature_sets.ipynb

##### Part 5: Finalizing the model
A little more of the same as was in part 4, but here rebuilt the model from scratch and decided to leave out one of the predictive features that was only adding ~2% to describing the variation. This made it more physcially justifiable.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/5_finalizing_the_model.ipynb

##### Part 6: Adding the temperature dimension
Because diffusion is a thermally activated process, I needed to make sure my model held up at all temperatures. It did.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/6_temperature.ipynb

##### Part 7: Extras and conclusion
Before concluding, I decided to revisit the categorical variables that didn't do much for the machine learning part. Here I performed ANOVA tests and determined that two of the categories had groups that were statistically significant. However, I determined this was slightly misleading because most of the variation was captured by one subgroup. 

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/7_extras.ipynb

##### Part 8: Splitting the data
After consideration of physical mechanisms, I decided to remove Ruddlesden-Popper materials from the analysis and try to build a model separately for them. Diffusion in Perovskites and Double Perovskites occurs by an vacancy migration mechanism. In Ruddlesden-Popper, it occurs by an interstitial mechanism. Electron affinity, the feature on which the model has been built, is not relevent for an interstitial mechanism.

http://nbviewer.ipython.org/github/asmiller1989/masters_notebooks/blob/master/python/8_separate_families.ipynb
