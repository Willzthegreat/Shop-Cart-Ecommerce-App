// import { defineType, defineField } from 'sanity';
// import { ImageIcon } from '@sanity/icons';


// export const blockContentType = defineType({
//   name: 'blockContent',
//   title: 'Block Content',
//   type: 'array',
//   of: [
//     defineField({
//       type: 'block',
//       styles: [
//         { title: 'Normal', value: 'normal' },
//         { title: 'H1', value: 'h1' },
//         { title: 'H2', value: 'h2' },
//         { title: 'H3', value: 'h3' },
//         { title: 'H4', value: 'h4' },
//         { title: 'Quote', value: 'blockquote' },
//       ],
//       lists: [
//         { title: 'Bullet', value: 'bullet' }, 
//         // { title: 'Numbered', value: 'number' },
//       ],
//       marks: {
//         decorators: [
//           { title: 'Strong', value: 'strong' },
//           { title: 'Emphasis', value: 'em' },
//         ],
//         annotations: [
//           {
//             title: 'URL',
//             name: 'link',
//             type: 'object',
//             fields: [
//               {
//                 name: 'href',
//                 type: 'url',
//                 title: 'URL',
//               },
//             ],
//           },
//         ],
//       },
//     }),

//     defineArrayMember({
//       type: 'image',
//       icon: ImageIcon,
//       options: {
//         hotspot: true,
//       },
//       fields: [
//         {
//           name: 'alt',
//           type: 'string',
//           title: 'Alternative text',
//           description: 'Important for SEO and accessibility.',
//         },
//       ],
//     })
//   ],
// });