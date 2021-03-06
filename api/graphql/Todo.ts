import {
  extendType,
  nonNull,
  objectType,
  stringArg
} from 'nexus'

export const Todo = objectType({
  name: 'Todo',
  definition(t) {
    t.string('id')
    t.string('title')
    t.string('description')
  }
})

export const TodoQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('todos', {
      type: 'Todo',
      resolve(_root, _args, ctx) {
        return ctx.db.todo.findMany({})
      }
    })
  }
})

export const TodoMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createTodo', {
      type: 'Todo',
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg())
      },
      resolve(_root, args, ctx) {
        const todo = {
          title: args.title,
          description: args.description
        }
        return ctx.db.todo.create({ data: todo })
      }
    })

    t.nonNull.field('updateTodo', {
      type: 'Todo',
      args: {
        id: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.todo.update({
          where: { id: args.id },
          data: {
            title: args.title,
            description: args.description
          }
        })
      }
    })

    t.nonNull.field('deleteTodo', {
      type: 'Todo',
      args: { id: nonNull(stringArg()) },
      resolve(_root, args, ctx) {
        return ctx.db.todo.delete({ where: { id: args.id } })
      }
    })
  }
})
