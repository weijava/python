#writed by wei_java
from math import log
import operator

def calcShannonEnt(dataSet):
    #计算calculate的值
    numEntries=len(dataSet)
    labelCounts={}
    for featVec in dataSet:     #创建字典为所有数据
        currentLabel=featVec[-1]
        if currentLabel not in labelCounts.keys():
            labelCounts[currentLabel]=0
        labelCounts[currentLabel] += 1
    shannonEnt=0.0
    for key in labelCounts:
        prob = float(labelCounts[key])/numEntries
        shannonEnt -= prob * log(prob, 2)  # get the log value
    return  shannonEnt

def createDataSet():      #创建数据
    dataSet = [[1,1,'yes'],
               [1,1, 'yes'],
               [1,0,'no'],
               [0,1,'no'],
               [0,1,'no']]
    return dataSet

def createLabels():         #创建labels
    labels = ['no surfacing', 'flippers']
    return labels

def splitDataSet(dataSet, axis, value):    #划分数据集，按照给定的特征划分数据集
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:      #abstract the fature
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis+1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet

def chooseBestFeatureToSplit(dataSet):   #选择最好的数据集划分方式
    numFeatures = len(dataSet[0])-1
    baseEntropy = calcShannonEnt(dataSet)
    bestInfoGain = 0.0; bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataSet(dataSet, i , value)
            prob = len(subDataSet)/float(len(dataSet))
            newEntropy +=prob * calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if(infoGain > bestInfoGain):
            bestInfoGain = infoGain
            bestFeature = i
    return bestFeature

def majorityCnt(classList):     #找出出现次数最多的分类名称的函数
    classCount = {}
    for vote in classList:
        if vote not in classCount.keys(): classCount[vote] = 0
        classCount[vote] += 1
    sortedClassCount = sorted(classCount.iteritems(), key=operator.itemgetter(1), reverse=True)
    return sortedClassCount[0][0]

def createTree(dataSet, labels):   #创建决策树
    classList = [example[-1] for example in dataSet]
    # the type is the same, so stop classify
    if classList.count(classList[0]) == len(classList):
        return classList[0]
    # traversal all the features and choose the most frequent feature
    if (len(dataSet[0]) == 1):
        return majorityCnt(classList)
    bestFeat = chooseBestFeatureToSplit(dataSet)
    bestFeatLabel = labels[bestFeat]
    myTree = {bestFeatLabel:{}}
    del(labels[bestFeat])
    #get the list which attain the whole properties
    featValues = [example[bestFeat] for example in dataSet]
    uniqueVals = set(featValues)
    for value in uniqueVals:
        subLabels = labels[:]
        myTree[bestFeatLabel][value] = createTree(splitDataSet(dataSet, bestFeat, value), subLabels)
    return myTree

def classify(inputTree, testVec):    #使用决策树进行分类
    for i in inputTree.keys():
       firstStr = i
       break
    secondDict = inputTree[firstStr]
    featLabels = createLabels()
    featIndex = featLabels.index(firstStr)
    for key in secondDict.keys():
        if testVec[featIndex] == key:
            if type(secondDict[key]).__name__ == 'dict':
                classLabel = classify(secondDict[key], testVec)
            else: classLabel = secondDict[key]
    return classLabel

myDat= createDataSet()
labels=createLabels()
myTree = createTree(myDat,labels)
print(myTree)
#classify(myTree,labels,[1,0])
result=classify(myTree,[1,1])
print(result)