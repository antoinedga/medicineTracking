library(stringr)

df <- read.csv("NDC_PackageData.csv")
pd <- df$PACKAGE_DESCRIPTION
pk <- pd
pk <- gsub(' > ','<and> ',pk)
pk <- gsub('in 1','<in>',pk)
pk <- gsub('[(][0-9]*-[0-9]*-[0-9]*[)]','',pk)
pk <- gsub('.?\\b[0-9]*.?[0-9]+\\b','',pk)
pk <- unique(pk)
pk <- str_split(pk, "<and>|[*]",simplify = TRUE)
x <- dim(pk)[1] * dim(pk)[2]
dim(pk) <- c(x,1)
pk <- unique(trimws(pk))
pk <- str_split(pk, " *<in> *",simplify = TRUE)
pairs <- pk[order(pk[,1]),]
x <- dim(pk)[1] * dim(pk)[2]
dim(pk) <- c(x,1)
pk <- unique(trimws(pk))
terms <- pk[order(pk)]
pk

write.csv(pairs,"pairs.csv", row.names = FALSE)
write.csv(terms,"terms.csv", row.names = FALSE)
