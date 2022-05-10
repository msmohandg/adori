class NodePath {
    constructor(e) {
        this.isFolder = e.isFolder;
        this.name = e.name;
        this.childs = new Map();
    }
}

// create tree structure for paths
function createTree(paths) {
    const treeRoot = new NodePath({isFolder: true, name: ""});

    for (const path of paths) {
        // Set current post as root
        let currPos = treeRoot;

        // For each part
        const parts = path.split("/");
        while (parts.length) {
            // Get cur
            const currPart = parts.shift();

            // Get child node, create if not exists
            let childNode = currPos.childs.get(currPart);
            if (!childNode) {
                childNode = new NodePath({
                    isFolder: !!parts.length,
                    name: currPart,
                });
                currPos.childs.set(currPart, childNode)
            }

            // Update current post to child node
            currPos = childNode;
        }
    }

    // Return tree
    return treeRoot;
}

const tree = createTree([
  "/webapp/assets/html/a.html",
  "/webapp/assets/js/c.js",
  "/webapp/assets/css/d.css",
  "/webapp/index.html",
  "/webapp/assets/html/b.html",
  "/tmp/x.csv"
]);

// Generator function prevent huge large file system strings
function *printTree(node, offset = 0, prev = "") {
    // Offset str
    const offsetStr = " ".repeat(offset);

    // Is folder
    if (!node.isFolder) {
        yield `${offsetStr}${prev}${node.name}`;
        return;
    }

    // Print node name
    yield `${offsetStr}${prev}${node.name}`;

    // For each child, print data inside
    for (const child of node.childs.values()) {
        for (const childData of printTree(child, offset + prev.length, " -")) {
            yield childData;
        }
    }
}


// Print tree step by step
for(const nodePath of printTree(tree)) {
    console.log(nodePath);
}