const {StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions} = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const permissions = 'c';
    const container = 'worddocs';


    context.res = {
        body: generateSASToken(
            process.env.AzureStorageAccountName,
            process.env.AzureStorageAccessKey,
            container,
            permissions
        )
    };
    context.done();
}

function generateSASToken(accountName, accessKey, container, permissions) {
    console.log(accountName);
    const sharedKeyCredential = new StorageSharedKeyCredential(new ArrayBuffer(accountName), new ArrayBuffer(accessKey));

    var expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    const sasKey = generateBlobSASQueryParameters({
        containerName: container,
        permissions: ContainerSASPermissions.parse(permissions),
        expiresOn: expiry
    }, sharedKeyCredential);

    return {
        sasKey: sasKey.toString(),
        url: `https://${accountName}.blob.core.windows.net`
    };
}