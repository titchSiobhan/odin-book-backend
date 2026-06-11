import 'dotenv/config';
import {Pool} from 'pg';
import {PrismaPg} from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';



import {faker} from '@faker-js/faker'


const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter})




 function createRandomUser() {
    return{
        userName: faker.internet.username(),
    email: faker.internet.email(),
    profileImage: faker.image.avatar(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
}
}



function createRandomPosts(userId) {
    return {
        postBody: faker.word.words(),
        image: faker.image.urlPicsumPhotos(),
        createdAt: faker.date.anytime(),
        userId,
    }
}
function createRandomImage(userId) {
    return {
        
        image: faker.image.urlPicsumPhotos(),
        createdAt: faker.date.anytime(),
        userId,
    }
}
function createRandomText(userId) {
    return {
        postBody: faker.word.words(),
        
        createdAt: faker.date.anytime(),
        userId
    }
}

function generateUsers(count = 5) {
    return faker.helpers.multiple(createRandomUser, {count})
}
function generatePost(count, userId) {
  return faker.helpers.multiple(() => createRandomPosts(userId), { count });
}
function generateImage(count, userId) {
  return faker.helpers.multiple(() => createRandomImage(userId), { count });
}

function generateText(count, userId) {
  return faker.helpers.multiple(() => createRandomText(userId), { count });
}


async function main() {
 const users = generateUsers(10);
const createdUsers = []
 for (const user of users) {
    const created =await prisma.user.create({
        data: user,
    })
    createdUsers.push(created)
 } 
//  const userIds = createdUsers.map(u => u.id);

 for (const user of createdUsers) {
    const posts = generatePost(3, user.id);
    const images = generateImage(2, user.id);
    const texts = generateText(5, user.id);

    for (const post of posts) {
     await prisma.posts.create({
  data: {
    postBody: post.postBody,
    image: post.image,
    createdAt: post.createdAt,
    author: {
      connect: { id: post.userId }
    }
  }
})
    }
    for (const image of images) {
      await prisma.posts.create({
  data: {
    
    image: image.image,
    createdAt: image.createdAt,
    author: {
      connect: { id: image.userId }
    }
  }
})
    }
    for (const text of texts) {
      await prisma.posts.create({
  data: {
    postBody: text.postBody,
   
    createdAt: text.createdAt,
    author: {
      connect: { id: text.userId }
    }
  }
})
    }
  }


 
 console.log('seeded users sucessfully')

 
}

main()
 .catch((e) => {
    console.error(e);
    process.exit(1)
 })
 .finally(async ()=> {
    await prisma.$disconnect();
    await pool.end()
 })