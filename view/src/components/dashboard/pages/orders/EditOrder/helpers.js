import axios from 'axios'

exports.getOrderById = (id) => {

    var data = JSON.stringify({"_id":"60662f89a37f721134c89f51"});
    
    var config = {
      method: 'post',
      url: 'http://localhost:8080/api/order/by_id',
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjExMTExMTExMTExMTExMTExMTExMTExMSIsIm5hbWUiOiJhZG1pbiJ9LCJhY2Nlc3MiOnsiY29uZmlnIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJpbnZpdGF0aW9uIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJpbnZlbnRvcnkiOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX0sIml0ZW0iOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX0sIm9yZGVyIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJwcm9kdWN0Ijp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJyb2xlIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJlYWNoZXMiOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX19LCJpYXQiOjE2MTgzMzc2MDYsImV4cCI6MTYxODMzOTQwNn0.KjuqlKZEkrvBLczeReB5JhDzeumXdyvk0xI8oNmU0NA', 
        'Content-Type': 'application/json'
      },
      data : {"_id":id}
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}


