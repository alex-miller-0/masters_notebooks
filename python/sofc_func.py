import pandas as pd
import numpy as np
import time
from sklearn import cross_validation
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import Ridge
import matplotlib.pyplot as plt


def arrhenius(param, ea, t, output_t):
    new_param = []
    for i, v in enumerate(param):
        try:
            v = float(v)
            ea[i] = float(ea[i])
            t[i] = float(t[i])
            newv = np.log10(v) + (-ea[i] * 11.605) * ( (1000. / float(output_t) ) - (1000. / t[i]) )
            new_param.append(newv)
        except:
            new_param.append(np.nan)
    return new_param


# Combine d_star and k_star vectors into D*k* vector
def dk_star(data, temp):
    d = arrhenius(data['d_star'].values, data['ead'].values, data['T'].values, temp)
    k = arrhenius(data['k_star'].values, data['eak'].values, data['T'].values, temp)

    dk = np.array(d) * np.array(k).T
    return dk


def optimize_k(iterations, len_data, X, Y, ret):
    scores = []
    k = []
    std = []

    start = time.clock()

    for i in range(2, 10):
        temp_scores = []
        for cycle in range(iterations):
            cycle_scores = []
            lko = cross_validation.KFold(len_data, n_folds=i, shuffle=True)
            for train_index, test_index in lko:
                x_train, x_test = X[train_index], X[test_index]
                y_train, y_test = Y[train_index], Y[test_index]
                model = make_pipeline(PolynomialFeatures(3), Ridge()).fit(x_train, y_train)
                cycle_scores.append(model.score(x_test, y_test))
            temp_scores.append(np.array(cycle_scores).mean())
        scores.append(np.array(temp_scores).mean())
        k.append(i)
    if ret == False:
        fig = plt.figure(figsize=(8, 4))
        plt.title('LKO score vs k')
        plt.xlabel('K')
        plt.ylabel('Score')
        plt.plot(k, scores)
        plt.show()
        print 'k optmization executed in: ' + str(time.clock() - start) + 's'
    else:
        return k[np.argmax(scores)]


def optimize_order(iterations, len_data, k, X, Y, ret):
    scores_low = []
    order_low = []
    scores = []
    order = []

    start = time.clock()

    for i in range(1, 10):
        temp_scores = []
        for cycle in range(iterations):
            cycle_scores = []
            lko = cross_validation.KFold(len_data, n_folds=k, shuffle=True)
            for train_index, test_index in lko:
                x_train, x_test = X[train_index], X[test_index]
                y_train, y_test = Y[train_index], Y[test_index]
                model = make_pipeline(PolynomialFeatures(i), Ridge()).fit(x_train, y_train)
                cycle_scores.append(model.score(x_test, y_test))
            temp_scores.append(np.array(cycle_scores).mean())
        if i < 6:
            scores_low.append(np.array(temp_scores).mean())
            order_low.append(i)
        scores.append(np.array(temp_scores).mean())
        order.append(i)

    if ret == False:
        fig = plt.figure(figsize=(14, 4))

        plt.subplot(121)
        plt.title('LKO score vs order')
        plt.xlabel('Order')
        plt.ylabel('Score')
        plt.plot(order, scores)

        plt.subplot(122)
        plt.title('LKO score vs lower orders')
        plt.xlabel('Order')
        plt.ylabel('Score')
        plt.plot(order_low, scores_low, color='red')

        plt.show()
        print 'Polynomial order optimization executed in: ' + str(time.clock() - start) + 's'
    else:
        return order[np.argmax(scores)]


def get_scores(iterations, k, order, len_data, X, Y, ret):
    scores = []
    std = []
    for cycle in range(iterations):
        cycle_scores = []
        lko = cross_validation.KFold(len_data, n_folds=k, shuffle=True)
        for train_index, test_index in lko:
            x_train, x_test = X[train_index], X[test_index]
            y_train, y_test = Y[train_index], Y[test_index]
            model = make_pipeline(PolynomialFeatures(order), Ridge()).fit(x_train, y_train)
            cycle_scores.append(model.score(x_test, y_test))
        scores.append(np.array(cycle_scores).mean())

    if ret == False:
        print 'Average score of this model: ' + str(np.array(scores).mean())
        print 'Standard deviation of scores: ' + str(np.array(scores).std())
    else:
        return np.array(scores).mean(), np.array(scores).std()



def e_affinity():
    ea = {
        'per': {
            "A": {
                'Gd': 0.137,
                'La': 0.470,
                'Pr': 0.962,
                'Sm': 0.162,
                'Nd': 0.162,
                'Ba': 0.14462,
                'Ce': 0.628,
                'Sr': 0.05206,
                'Y': 0.307,
                'Ca': 0.02455
            },
            "A'": {'Ba': 0.14462},
            "B": {
                'Co': 0.6633,
                'Ni': 1.15716,
                'Cu': 1.23578,
                'Mn': -1,
                'Ga': 0.43,
                'Fe': 0.151,
                'Ti': 0.079,
                'Cr': 0.67584,
                'Mg': 0.0
            }
        },
        'rp': {
            "A": {
                'Gd': 0.137,
                'La': 0.470,
                'Pr': 0.962,
                'Sm': 0.162,
                'Nd': 0.162,
                'Ba': 0.14462,
                'Ce': 0.628,
                'Sr': 0.05206,
                'Y': 0.307,
                'Ca': 0.02455
            },
            "A'": {'Ba': 0.14462},
            "B": {
                'Co': 0.6633,
                'Ni': 1.15716,
                'Cu': 1.23578,
                'Mn': -1,
                'Ga': 0.43,
                'Fe': 0.151,
                'Ti': 0.079,
                'Cr': 0.67584,
                'Mg': 0.0
            }
        }
    }
    return ea


def d_count():
    d_count = {
        'per': {
            'Co': 6,
            'Mn': 4,
            'Ga': 10,
            'Fe': 5,
            'Ti': 1,
            'Cr': 3,
            'Mg': 0
        },
        'rp': {
            'Ni': 8,
            'Cu': 9,
            'Co': 7
        }
    }
    return d_count


def radii():
    #Data from : http://abulafia.mt.ic.ac.uk/shannon/ptable.php

    #Perovskite and double perovskites have coordination number (CN) = 12 for A site cations.
    #Double perovskites also show CN=12 for A' cations.
    #All materials show octahedral coordination (CN=6) for B-site cations

    #Spin state may depend on temperature and coordination environment, but generally I assume
    #    B-site cations maintain a high spin state because oxygen is a low-field ligand.

    #B-site cations have a 3+ oxidation state for perovskites/double perovskites and
    #  a 2+ oxidation state for Ruddlesden-Popper phases
    radii = {
        'per': {
            "A": {
                'Gd': 1.107,
                'La': 1.36,
                'Pr': 1.179,
                'Sm': 1.24,
                'Nd': 1.27,
                'Ba': 1.61,
                'Ce': 1.34,
                'Sr': 1.44,
                'Y': 1.075,
                'Ca': 1.34
            },
            "A'": {'Ba': 1.61},
            "B": {
                'Co': 0.61,
                'Mn': 0.645,
                'Ga': 0.62,
                'Fe': 0.645,
                'Ti': 0.67,
                'Cr': 0.615,
                'Mg': 0.72
            }
        },  #Ruddlesden-Popper phases have CN=9 for A cations
        'rp': {
            'A': {
                'La': 1.216,
                'Nd': 1.163,
                'Pr': 1.179,
                'Sr': 1.31,
                'Ca': 1.18
            },
            'B': {
                'Ni': 0.69,
                'Cu': 0.73,
                'Co': 0.745
            }
        }
    }
    return radii


def t_factor(avg_r_A, avg_r_B):
    r_O = 1.4
    return (avg_r_A + r_O) / (2. ** 0.5 * (avg_r_B + r_O))


def r_critical(rA, rB, t_factor):
    rO = 1.4
    if t_factor > 1.:
        rc = -0.5 * rB + 0.5 * rO + (0.5 * (rA + rO) ** 2 ) / (4. * rA - 2. * rB + 2. * rO)
    elif t_factor < 1.:
        rc = 2. ** 0.5 * rB - rO - (2. + 2. ** 0.5) * rA + ( (3. + 2. * 2. ** 0.5) * ((rA + rO) ** 2)) / (
            2. * rA + (2. * 2. ** 0.5 - 2.) * rB + (2. + 2. ** 0.5) * rO)
    else:
        print 'WARNING: T-factor = 1'
        rc = 0
    return rc


def features(df):
    ea_a, ea_b, r_a, r_b, d_count_b = ([] for i in range(5))
    avg_ea_a, avg_ea_b, avg_r_a, avg_r_b, avg_d_count_b = ([] for i in range(5))
    t_fac = []
    r_crit = []

    ea = e_affinity()
    de_count = d_count()
    r = radii()

    for i in range(len(df)):
        a = df.loc[i]['A_par']
        p_a = df.loc[i]['pA_par']
        aa = df.loc[i]['A_dop']
        p_aa = df.loc[i]['pA_dop']
        #a_prime = df.loc[i]['A']
        #p_a_prime = 1
        b = df.loc[i]['B_par']
        p_b = df.loc[i]['pB_par']
        bb = df.loc[i]['B_dop']
        p_bb = df.loc[i]['pB_dop']

        if df.loc[i]['family'] == 'Perovskite' or df.loc[i]['family'] == 'Double Perovskite':
            f = 'per'
        elif df.loc[i]['family'] == 'Ruddlesden-Popper':
            f = 'rp'

        if type(a) == str and type(b) == str:
            pure_ea = ea[f]['A'][a]
            ea_a.append(pure_ea)

            pure_eb = ea[f]['B'][b]
            ea_b.append(pure_eb)

            pure_ra = r[f]['A'][a]
            r_a.append(pure_ra)

            pure_rb = r[f]['B'][b]
            r_b.append(pure_rb)

            count = de_count[f][b]
            d_count_b.append(count)
            temp_ra = 0
            temp_rb = 0

            if type(aa) == str:
                avg_ea = (p_aa) * (ea[f]['A'][aa]) + (p_a) * (pure_ea)
                avg_ea_a.append(avg_ea)
                avg_ra = p_a * pure_ra + p_aa * r[f]['A'][aa]
                avg_r_a.append(avg_ra)
                temp_ra = avg_ra
            else:
                avg_ea_a.append(pure_ea)
                avg_r_a.append(pure_ra)
                temp_ra = pure_ra

            if type(bb) == str:
                avg_eb = (p_bb) * (ea[f]['B'][bb]) + (p_b) * (pure_eb)
                avg_ea_b.append(avg_eb)
                avg_rb = p_b * pure_rb + p_bb * r[f]['B'][bb]
                avg_r_b.append(avg_rb)
                avg_count = p_b * count + p_bb * de_count[f][bb]
                avg_d_count_b.append(avg_count)
                temp_rb = avg_rb
            else:
                avg_ea_b.append(pure_eb)
                avg_r_b.append(pure_rb)
                avg_d_count_b.append(count)
                temp_rb = pure_rb

            temp_t = t_factor(temp_ra, temp_rb)
            t_fac.append(temp_t)
            r_crit.append(r_critical(temp_ra, temp_rb, temp_t))

        else:
            ea_a.append(np.nan)
            ea_b.append(np.nan)
            r_a.append(np.nan)
            r_b.append(np.nan)
            d_count_b.append(np.nan)
            avg_ea_a.append(np.nan)
            avg_ea_b.append(np.nan)
            avg_r_a.append(np.nan)
            avg_r_b.append(np.nan)
            avg_d_count_b.append(np.nan)
            t_fac.append(np.nan)
            r_crit.append(np.nan)

    df['EA_A'] = pd.Series(ea_a, index=df.index)
    df['EA_B'] = pd.Series(ea_b, index=df.index)
    df['r_A'] = pd.Series(r_a, index=df.index)
    df['r_B'] = pd.Series(r_b, index=df.index)
    df['d_count_B'] = pd.Series(d_count_b, index=df.index)

    df['avg_EA_A'] = pd.Series(avg_ea_a, index=df.index)
    df['avg_EA_B'] = pd.Series(avg_ea_b, index=df.index)
    df['avg_r_A'] = pd.Series(avg_r_a, index=df.index)
    df['avg_r_B'] = pd.Series(avg_r_b, index=df.index)
    df['avg_d_count_B'] = pd.Series(avg_d_count_b, index=df.index)

    df['tol_factor'] = pd.Series(t_fac, index=df.index)
    df['r_critical'] = pd.Series(r_crit, index=df.index)

    return df