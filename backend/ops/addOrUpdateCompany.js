const { Company, } = require('../types');

const { makeAlias, } = require('../utils');

const makeWords = require('../makeWords');

function addOrUpdateCompany(request, response){
  const company = new Company();

  const { id, data, } = request.params;

  if (typeof id !== 'undefined') {
    company.id = id;

    return company.fetch().then(function (obj) {

      data.forEach(function({ fieldName, value, }){
        obj.set(fieldName, value);

        if(fieldName === 'displayName'){
          obj.set('displayNameLowerCase', makeAlias(value));
        }
      });

      obj.set('words', makeWords([
        obj.get('displayName'),
        obj.get('activity'),
      ]));

      return obj.save(null);
    }).then(
      function (object) {
        response.success({id: object.id});
      },
      function (error) {
        response.error(formatError(error));
      }
    );
  } else {
    company.set('kind', 'Company');
  }

  data.forEach(function({ fieldName, value, }){
    company.set(fieldName, value);

    if(fieldName === 'displayName'){
      company.set('displayNameLowerCase', makeAlias(value));
    }
  });

  company.set('user', request.user);

  company.set('words', makeWords([
    company.get('displayName'),
    company.get('activity'),
  ]));

  return company.save(null).then(
    function (object) {
      response.success({id: object.id});
    },
    function (error) {
      response.error(formatError(error));
    }
  );
}

module.exports = addOrUpdateCompany;

// function addOrUpdateCompany(request, response) {
//   const company = new Company();
//
//   const id = request.params.id;
//
//   if(id){
//
//     company.id = id;
//
//     return company.fetch().then(function (obj) {
//
//       request.params.fieldInfos.forEach(function (fieldInfo) {
//         if (fieldInfo.fieldName === 'legalForm') {
//           // obj.set(fieldInfo.fieldName, fieldInfo.value && parseInt(fieldInfo.value));
//           obj.set(fieldInfo.fieldName, legalFormsMap[fieldInfo.value]);
//           return;
//         }
//
//         if (fieldInfo.fieldName === 'logo') {
//           return;
//         }
//
//         obj.set(fieldInfo.fieldName, fieldInfo.value);
//
//         if (fieldInfo.fieldName === 'displayName') {
//           obj.set('displayNameLowerCase', makeAlias(fieldInfo.value));
//         }
//       });
//
//       obj.set('words', makeWords([
//         obj.get('displayName'),
//         obj.get('activity'),
//       ]));
//
//       return obj.save(null).then(obj => {
//         const logo = request.params.logo;
//
//         if (typeof logo !== 'undefined') {
//
//           function dropLogos() {
//             const File = FileClass({id: obj.id,});
//             const q = new Parse.Query(File);
//             q.equalTo('type', 'Logo');
//             q.equalTo('company', obj);
//             return q.find().then(logos => Parse.Object.destroyAll(logos));
//           }
//
//           if (logo) {
//             const fp = new Parse.File(logo.name, {base64: logo.dataBase64,}, logo.type);
//             return fp.save(null).then(fileObj => {
//               const File = FileClass({id: obj.id,});
//               const myLogo = new File();
//
//               myLogo.set('name', logo.name);
//               myLogo.set('contentType', logo.type);
//               myLogo.set('size', logo.size);
//               myLogo.set('file', fileObj);
//
//               // myLogo.set('company', { className: 'Company', id: obj.id, });
//
//               myLogo.set('type', 'Logo');
//               myLogo.set('company', obj);
//
//               return dropLogos().then(() => {
//                 return myLogo.save(null);
//               });
//             }).then(() => obj);
//           } else {
//             return dropLogos().then(() => {
//               return obj;
//             });
//           }
//         }
//
//         return obj;
//       });
//     }).then(
//       function (object) {
//         response.success({companyId: object.id});
//       },
//       function (error) {
//         response.error(formatError(error));
//       }
//     );
//
//   }else{
//
//     request.params.fieldInfos.forEach(function (fieldInfo) {
//       if (fieldInfo.fieldName === 'legalForm') {
//         // company.set(fieldInfo.fieldName, fieldInfo.value && parseInt(fieldInfo.value));
//         company.set(fieldInfo.fieldName, legalFormsMap[fieldInfo.value]);
//         return;
//       }
//
//       if (fieldInfo.fieldName === 'logo') {
//         return;
//       }
//
//       company.set(fieldInfo.fieldName, fieldInfo.value);
//
//       if (fieldInfo.fieldName === 'displayName') {
//         company.set('displayNameLowerCase', makeAlias(fieldInfo.value));
//       }
//     });
//
//     company.set('words', makeWords([
//       company.get('displayName'),
//       company.get('activity'),
//     ]));
//
//     return company.save(null).then(obj => {
//       const logo = request.params.logo;
//
//       if (typeof logo !== 'undefined') {
//
//         if (logo) {
//           const fp = new Parse.File(logo.name, {base64: logo.dataBase64,}, logo.type);
//           return fp.save(null).then(fileObj => {
//             const File = FileClass({id: obj.id,});
//             const myLogo = new File();
//
//             myLogo.set('name', logo.name);
//             myLogo.set('contentType', logo.type);
//             myLogo.set('size', logo.size);
//             myLogo.set('file', fileObj);
//
//             myLogo.set('type', 'Logo');
//             myLogo.set('company', obj);
//
//             return myLogo.save(null);
//           }).then(() => obj);
//         } else {
//           return obj;
//         }
//       }
//
//       return company;
//     }).then(
//       function (object) {
//         response.success({companyId: object.id});
//       },
//       function (error) {
//         response.error(formatError(error));
//       }
//     );
//   }
//
// }
