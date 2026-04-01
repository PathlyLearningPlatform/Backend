MATCH (prerequisite:Skill)
WHERE prerequisite.parentId IS NULL
OPTIONAL MATCH (prerequisite)<-[r:PREREQUISITE_OF]-(target:Skill)
WHERE target.parentId IS NULL
RETURN prerequisite, r, target