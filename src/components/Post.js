import { Item, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


function Post({ post }) {
    return (
        <Item  as={Link} to={ `/posts/${post.id}`} >
            <Item.Image src = {post.imageUrl || 
                "https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg"
            } size="small"/>
            <Item.Content>
                <Item.Meta>
                    <span style={{ fontWeight: 'bold', color: 'red' }}>
                        {post.author.titlename || ''}
                    </span>
                    {post.author.photoURL ? ( 
                        <Image src = {post.author.photoURL} avatar /> 
                    ) : (
                        <Icon name="user circle"/> 
                    )}{' '}
                    {post.author.displayName || '使用者'}。{post.topic}
                </Item.Meta>
                <Item.Header> {post.title} </Item.Header>
                <Item.Description> {post.content} </Item.Description>
                <Item.Extra>
                    留言 {post.commentsCount || 0}。讚 {post.likedBy?.length || 0}
                </Item.Extra>
            </Item.Content>
        </Item>
    );
}

export default Post;