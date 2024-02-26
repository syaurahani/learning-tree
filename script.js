document.addEventListener("DOMContentLoaded", function () {
    // Dummy data to represent the learning tree
    const learningTreeData = [];

    // Add Learning button event
    $("#add-learning-btn").click(function () {
        const learningInput = $("#learning-input").val();
        if (learningInput.trim() !== "") {
            learningTreeData.push({ type: "learning", name: learningInput });
            updateLearningTree();
            $("#learning-input").val("");
        }
    });

    // Add Category button event
    $("#add-category-btn").click(function () {
        const categoryInput = $("#category-input").val();
        if (categoryInput.trim() !== "") {
            learningTreeData.push({ type: "category", name: categoryInput, children: [] });
            updateLearningTree();
            updateCategorySelect();
            $("#category-input").val("");
        }
    });

    // Add Learning to Category button event
    $("#add-learning-to-category-btn").click(function () {
        const learningInput = $("#learning-input").val();
        const selectedCategory = $("#category-select").val();

        if (learningInput.trim() !== "" && selectedCategory.trim() !== "") {
            const category = findCategory(selectedCategory);
            if (category) {
                category.children.push({ type: "learning", name: learningInput });
                updateLearningTree();
                $("#learning-input").val("");
            }
        }
    });

    // Custom jQuery-like function to find an element containing specific text
    jQuery.expr[':'].contains = function (a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    // Function to update the learning tree in the HTML
    function updateLearningTree() {
        const learningTree = $("#learning-tree");
        learningTree.empty();
        generateTreeHTML(learningTree, learningTreeData);
    }

    // Function to generate HTML for the learning tree
    function generateTreeHTML(container, data) {
        for (let i = data.length - 1; i >= 0; i--) {
            const item = data[i];
            const listItem = $("<li>");

            if (item.type === "category") {
                const deleteButton = $("<span class='delete-btn'>[Delete]</span>");
                deleteButton.click(function () {
                    removeCategory(item);
                    updateLearningTree();
                    updateCategorySelect();
                });
                listItem.append(item.name, deleteButton);

                if (item.children && item.children.length > 0) {
                    const sublist = $("<ul class='tree-category'>");
                    generateTreeHTML(sublist, item.children);
                    listItem.append(sublist);
                }
            } else if (item.type === "learning") {
                const deleteButton = $("<span class='delete-btn'>[Delete]</span>");
                deleteButton.click(function () {
                    removeLearning(item);
                    updateLearningTree();
                });
                listItem.append(item.name, deleteButton);
            }

            container.prepend(listItem);
        }
    }

    // Function to update the category select dropdown
    function updateCategorySelect() {
        const categorySelect = $("#category-select");
        categorySelect.empty();
        categorySelect.append('<option value="" disabled selected>Select Category</option>');

        learningTreeData.forEach(item => {
            if (item.type === "category") {
                const option = $("<option>");
                option.val(item.name);
                option.text(item.name);
                categorySelect.append(option);
            }
        });
    }

    // Function to find a category in the learning tree data
    function findCategory(categoryName) {
        for (const item of learningTreeData) {
            if (item.type === "category" && item.name === categoryName) {
                return item;
            }
        }
        return null;
    }

    // Function to remove a category and its children from the learning tree data
    function removeCategory(category) {
        const index = learningTreeData.indexOf(category);
        if (index !== -1) {
            learningTreeData.splice(index, 1);
        }
    }

    // Function to remove a learning item from the learning tree data
    function removeLearning(learning) {
        for (const category of learningTreeData) {
            if (category.type === "category" && category.children) {
                const index = category.children.indexOf(learning);
                if (index !== -1) {
                    category.children.splice(index, 1);
                    return;
                }
            }
        }
    }

    // Initial update of the learning tree and category select
    updateLearningTree();
    updateCategorySelect();
});

