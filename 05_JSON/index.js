let userObj = {
    username: "eva",
    grade: 85,
    password: "pass123",
    isConnected: true,
    address: {
        city: "LA",
        street: "Sunset Blvd"
    },
    allGrades: [{ csharp: 90 }, { cpp: 70 }, 90, 100, 85]
}

let newGrade = userObj.grade + 10; //get
userObj.grade += 10; //set

userObj.id = 100; //add new property

let userObj2 = userObj; // its the refrence for userObj (they are the same object)
userObj2.grade += 10;
userObj2.grade = 0;
let grade1 = userObj.grade;

userObj2.address.street = "";
userObj["address"].city = "New York"; // userObj["address"]["city"] = "New York";


let arr = [userObj,
    {
        username: "eva",
        grade: 85,
        password: "pass123",
        isConnected: true,
        address: {
            city: "LA",
            street: "Sunset Blvd"
        },
        allGrades: [{ csharp: 90 }, { cpp: 70 }, 90, 100, 85]
    },
];

arr[0].allGrades[1] = { CPP: 80 };
arr[1].avg = 95;

let user2 = arr[1];
user2.password = "12345";


