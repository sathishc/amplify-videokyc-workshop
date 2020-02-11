**➡️ From the photoalbums directory, run** `amplify add api` and respond to the prompts like this:
850e727807851182f33ac5bb4c8843ea29ebfd9f

**➡️ Replace `photoalbums/amplify/backend/api/photoalbums/schema.graphql` with** <span class="clipBtn clipboard" data-clipboard-target="#id850e727807851182f33ac5bb4c8843ea29ebfd9fphotoalbumsamplifybackendapiphotoalbumsschemagraphql"><strong>this content</strong></span> (click the gray button to copy to clipboard).  And, **remember to save the file**.
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id850e727807851182f33ac5bb4c8843ea29ebfd9fphotoalbumsamplifybackendapiphotoalbumsschemagraphql"></div> <script type="text/template" data-diff-for="diff-id850e727807851182f33ac5bb4c8843ea29ebfd9fphotoalbumsamplifybackendapiphotoalbumsschemagraphql">commit 850e727807851182f33ac5bb4c8843ea29ebfd9f
Author: Gabe Hollombe <gabe@avantbard.com>
Date:   Thu Feb 6 10:38:37 2020 +0800

    amplify add api and push

diff --git a/photoalbums/amplify/backend/api/photoalbums/schema.graphql b/photoalbums/amplify/backend/api/photoalbums/schema.graphql
new file mode 100644
index 0000000..a9d7fde
--- /dev/null
+++ b/photoalbums/amplify/backend/api/photoalbums/schema.graphql
@@ -0,0 +1,25 @@
+type Album 
+@model 
+@auth(rules: [{allow: owner}]) {
+    id: ID!
+    name: String!
+    photos: [Photo] @connection(keyName: "byAlbum", fields: ["id"])
+}
+
+type Photo 
+@model 
+@key(name: "byAlbum", fields: ["albumId"])
+@auth(rules: [{allow: owner}]) {
+    id: ID!
+    albumId: ID!
+    album: Album @connection(fields: ["albumId"])
+    bucket: String!
+    fullsize: PhotoS3Info!
+    thumbnail: PhotoS3Info!
+}
+
+type PhotoS3Info {
+    key: String!
+    width: Int!
+    height: Int!
+}
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id850e727807851182f33ac5bb4c8843ea29ebfd9fphotoalbumsamplifybackendapiphotoalbumsschemagraphql" style="position: relative; left: -1000px; width: 1px; height: 1px;">type Album 
@model 
@auth(rules: [{allow: owner}]) {
    id: ID!
    name: String!
    photos: [Photo] @connection(keyName: "byAlbum", fields: ["id"])
}

type Photo 
@model 
@key(name: "byAlbum", fields: ["albumId"])
@auth(rules: [{allow: owner}]) {
    id: ID!
    albumId: ID!
    album: Album @connection(fields: ["albumId"])
    bucket: String!
    fullsize: PhotoS3Info!
    thumbnail: PhotoS3Info!
}

type PhotoS3Info {
    key: String!
    width: Int!
    height: Int!
}
</textarea>
{{< /safehtml >}}

Note: in Cloud9 you can mouse-over the file name in the terminal, click it, and select 'Open'.

1. ➡️ Return to your command prompt and **press Enter once** to continue

1. **➡️ Run** `amplify push` and confirm you'd like to continue with the updates

1. ➡️ When prompted about code generation, **select 'Yes'**, then **choose 'javascript'**, and accept the defaults for the remaining prompts.

1. ➡️ Wait a few minutes while Amplify takes care of provisioning new resources for us.